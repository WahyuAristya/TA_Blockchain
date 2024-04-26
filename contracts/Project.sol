//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

contract Project {
    enum State {
        Fundraising,
        Expired,
        Successful
    }

    struct WithdrawRequest {
        string description;
        uint256 amount;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) voters;
        bool isCompleted;
        address payable reciptent;
    }

    address payable public creator;
    address[] public trustees;
    uint256 public minimumContribution;
    uint256 public deadline;
    uint256 public targetContribution;
    uint256 public raisedAmount;
    uint256 public noOfContributors;
    string public projectTitle;
    string public projectDes;
    State public state = State.Fundraising;

    mapping(address => uint256) public contributors;
    mapping(uint256 => WithdrawRequest) public withdrawRequests;

    uint256 public numOfWithdrawRequests = 0;

    // Modifiers
    modifier isCreator() {
        require(msg.sender == creator, 'You dont have access to perform this operation!');
        _;
    }

    modifier onlyTrustee() {
        bool isTrustee = false;
        for (uint256 i = 0; i < trustees.length; i++) {
            if (trustees[i] == msg.sender) {
                isTrustee = true;
                break;
            }
        }
        require(isTrustee, 'Only trustee can perform this operation!');
        _;
    }

    // Events
    event Expired(address contributor, State state);
    event FundingReceived(address contributor, uint256 amount, uint256 currentTotal);
    event WithdrawRequestCreated(uint256 requestId, string description, uint256 amount, uint256 yesVotes, uint256 noVotes, bool isCompleted, address reciptent);
    event WithdrawVote(address voter, uint256 totalVote);
    event AmountWithdrawSuccessful(uint256 requestId, string description, uint256 amount, uint256 yesVotes, uint256 noVotes, bool isCompleted, address reciptent);
    event Refund(address contributor, uint256 amount);

    constructor(
        address _creator,
        uint256 _minimumContribution,
        uint256 _deadline,
        uint256 _targetContribution,
        string memory _projectTitle,
        string memory _projectDes
    ) {
        creator = payable(_creator);
        minimumContribution = _minimumContribution;
        deadline = _deadline;
        targetContribution = _targetContribution;
        projectTitle = _projectTitle;
        projectDes = _projectDes;
        raisedAmount = 0;

        trustees = [
        0x04fb8aA93070ccB375ECA12e98d6a995555e2017, 0xe0b0d918dCefE0f414b77A2d81850eA8776A34A9, 
        0xba83D2D5f76F34D0592452D3441902016878CB1a, 0xcFf2EE28902259E8d00E1198E5565EB946F2A897,
        0x316Fd248ceF6aA4d17267cF2B8f2065bA71fEB7f
        ];
    }

    function checkFundingCompleteOrExpire() internal {
        if (raisedAmount >= targetContribution) {
            state = State.Successful;
        } else if (block.timestamp > deadline) {
            state = State.Expired;
        }
    }

    function contribute(address _contributor) public payable {
        if (state != State.Expired) {
            if (contributors[_contributor] == 0) {
                noOfContributors++;
            }
            contributors[_contributor] += msg.value;
            raisedAmount += msg.value;
            emit FundingReceived(_contributor, msg.value, raisedAmount);
            checkFundingCompleteOrExpire();
        }
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function createWithdrawRequest(string memory _description, uint256 _amount, address payable _reciptent) public isCreator() {
        WithdrawRequest storage newRequest = withdrawRequests[numOfWithdrawRequests];
        numOfWithdrawRequests++;

        newRequest.description = _description;
        newRequest.amount = _amount;
        newRequest.yesVotes = 0;
        newRequest.noVotes = 0;
        newRequest.isCompleted = false;
        newRequest.reciptent = _reciptent;

        emit WithdrawRequestCreated(numOfWithdrawRequests, _description, _amount, 0, 0, false, _reciptent);
        checkFundingCompleteOrExpire();
    }

    function voteWithdrawRequest(uint256 _requestId, bool _vote) public onlyTrustee() {
        WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
        require(!requestDetails.voters[msg.sender], 'You already voted!');
        
        if (_vote) {
            requestDetails.yesVotes++;
        } else {
            requestDetails.noVotes++;
        }
        
        requestDetails.voters[msg.sender] = true;
        emit WithdrawVote(msg.sender, requestDetails.yesVotes + requestDetails.noVotes);
    }

    function withdrawRequestedAmount(uint256 _requestId) public isCreator() {
        WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
        require(requestDetails.isCompleted == false,'Request already completed');
        
        uint256 minVotesRequired = 3; // Set minimum votes required to 3
        require(allTrusteesVoted(_requestId), 'Not all trustees have voted');
        
        if (requestDetails.yesVotes >= minVotesRequired) {
            requestDetails.reciptent.transfer(requestDetails.amount);
            requestDetails.isCompleted = true;
            emit AmountWithdrawSuccessful(_requestId, requestDetails.description, requestDetails.amount, requestDetails.yesVotes, requestDetails.noVotes, true, requestDetails.reciptent);
        } else if (requestDetails.noVotes > requestDetails.yesVotes) {
            requestRefund();
            requestDetails.isCompleted = true;
            emit AmountWithdrawSuccessful(_requestId, requestDetails.description, requestDetails.amount, requestDetails.yesVotes, requestDetails.noVotes, false, requestDetails.reciptent);
        }
    }

    function allTrusteesVoted(uint256 _requestId) internal view returns (bool) {
        WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
        for (uint256 i = 0; i < trustees.length; i++) {
            if (!requestDetails.voters[trustees[i]]) {
                return false;
            }
        }
        return true;
    }

    function requestRefund() public returns(bool) {
        require(contributors[msg.sender] > 0, 'You dont have any contributed amount!');
        address payable user = payable(msg.sender);
        user.transfer(contributors[msg.sender]);
        contributors[msg.sender] = 0;

        return true;
    }

    function getProjectDetails() public view returns (
        address payable projectStarter,
        uint256 minContribution,
        uint256 projectDeadline,
        uint256 goalAmount,
        uint256 completedTime,
        uint256 currentAmount,
        string memory title,
        string memory desc,
        State currentState,
        uint256 balance
    ) {
        projectStarter = creator;
        minContribution = minimumContribution;
        projectDeadline = deadline;
        goalAmount = targetContribution;
        completedTime = block.timestamp;
        currentAmount = raisedAmount;
        title = projectTitle;
        desc = projectDes;
        currentState = state;
        balance = address(this).balance;
    }

    // Function to retrieve trustee addresses
    function getTrustees() public view returns (address[] memory) {

        return trustees;
    }
}
