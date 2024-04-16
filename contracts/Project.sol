//SPDX-License-Identifier: Unlicense
// pragma solidity ^0.8.0;


// // [X] Anyone can contribute
// // [X] End project if targeted contribution amount reached
// // [X] Expire project if raised amount not fullfill between deadline
// //    & return donated amount to all contributor .
// // [X] Owner need to request contributers for withdraw amount.
// // [X] Owner can withdraw amount if 50% contributors agree

// contract Project{

//    // Project state
//     enum State {
//         Fundraising,
//         Expired,
//         Successful
//     }

//     // Structs

//     struct WithdrawRequest{
//         string description;
//         uint256 amount;
//         uint256 noOfVotes;
//         mapping(address => bool) voters;
//         bool isCompleted;
//         address payable reciptent; 
//     }

//     // Variables
//     address payable public creator;
//     uint256 public minimumContribution;
//     uint public deadline;
//     uint256 public targetContribution; // required to reach at least this much amount
//     uint public completeAt;
//     uint256 public raisedAmount; // Total raised amount till now
//     uint256 public noOfContributers;
//     string public projectTitle;
//     string public projectDes;
//     State public state = State.Fundraising; 

//     mapping (address => uint) public contributiors;
//     mapping (uint256 => WithdrawRequest) public withdrawRequests;

//     uint256 public numOfWithdrawRequests = 0;

//     // Modifiers
//     modifier isCreator(){
//         require(msg.sender == creator,'You dont have access to perform this operation !');
//         _;
//     }

//     // Events
//     event Expired(address contributor, State state);
//     // Event that will be emitted whenever funding will be received
//     event FundingReceived(address contributor, uint amount, uint currentTotal);
//     // Event that will be emitted whenever withdraw request created
//     event WithdrawRequestCreated(
//         uint256 requestId,
//         string description,
//         uint256 amount,
//         uint256 noOfVotes,
//         bool isCompleted,
//         address reciptent
//     );
//     // Event that will be emitted whenever contributor vote for withdraw request
//     event WithdrawVote(address voter, uint totalVote);
//     // Event that will be emitted whenever contributor vote for withdraw request
//     event AmountWithdrawSuccessful(
//         uint256 requestId,
//         string description,
//         uint256 amount,
//         uint256 noOfVotes,
//         bool isCompleted,
//         address reciptent
//     );


//     // @dev Create project
//     // @return null

//    constructor(
//        address _creator,
//        uint256 _minimumContribution,
//        uint _deadline,
//        uint256 _targetContribution,
//        string memory _projectTitle,
//        string memory _projectDes
//    ) {
//        creator = payable(_creator);
//        minimumContribution = _minimumContribution;
//        deadline = _deadline;
//        targetContribution = _targetContribution;
//        projectTitle = _projectTitle;
//        projectDes = _projectDes;
//        raisedAmount = 0;
//    }


//    // @dev complete or expire funding
//     // @return null
    
//     uint256 blockTimestampMilliseconds = block.timestamp * 1000;


//     function checkFundingCompleteOrExpire() internal {
//         if(raisedAmount >= targetContribution){
//             state = State.Successful; 
//         }else if(block.timestamp > deadline){
//             state = State.Expired; 
//         }
//         completeAt = block.timestamp;
//     }

//     function setStateExpired() public {
//         state = State.Expired;
//     }


//     // @dev Anyone can contribute
//     // @return null


// function contribute(address _contributor) public payable {
//     // require(state == State.Fundraising, "Project is not in fundraising state");
//     // require(block.timestamp * 1000 > deadline, "Deadline lewat");
//     if (state != State.Expired) {
//         if (contributiors[_contributor] == 0){
//                 noOfContributers++;
//             }
//         contributiors[_contributor] += msg.value;
//         raisedAmount += msg.value;
//         emit FundingReceived(_contributor,msg.value,raisedAmount);
//         checkFundingCompleteOrExpire();
//     }
    
// }

//     // @dev Get contract current balance
//     // @return uint 

//     function getContractBalance() public view returns(uint256){
//         return address(this).balance;
//     }


//     // @dev Request contributor for withdraw amount
//     // @return null
   
//     function createWithdrawRequest(string memory _description,uint256 _amount,address payable _reciptent) public isCreator() {
//         // require(state == State.Expired || state == State.Successful, "Project is still fundraising");
//         WithdrawRequest storage newRequest = withdrawRequests[numOfWithdrawRequests];
//         numOfWithdrawRequests++;

//         newRequest.description = _description;
//         newRequest.amount = _amount;
//         newRequest.noOfVotes = 0;
//         newRequest.isCompleted = false;
//         newRequest.reciptent = _reciptent;
        

//         emit WithdrawRequestCreated(numOfWithdrawRequests,_description, _amount,0,false,_reciptent );
//         checkFundingCompleteOrExpire();
//     }







//     // @dev contributors can vote for withdraw request
//     // @return null

//     function voteWithdrawRequest(uint256 _requestId) public {
//         require(contributiors[msg.sender] > 0,'Only contributor can vote !');
//         WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
//         require(requestDetails.voters[msg.sender] == false,'You already voted !');
//         requestDetails.voters[msg.sender] = true;
//         requestDetails.noOfVotes += 1;
//         emit WithdrawVote(msg.sender,requestDetails.noOfVotes);
//     }

//     // @dev Owner can withdraw requested amount
//     // @return null

//     function withdrawRequestedAmount(uint256 _requestId) public isCreator(){
//         WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
//         require(requestDetails.isCompleted == false,'Request already completed');
//         // Tentukan jumlah minimum suara yang diperlukan sebagai 50% + 1 dari jumlah kontributor
//         uint256 minVotesRequired = (noOfContributers / 2) + 1;
//         require(requestDetails.noOfVotes >= minVotesRequired, 'Insufficient votes for this request');

//         // Lakukan transfer dana
//         requestDetails.reciptent.transfer(requestDetails.amount);
//         requestDetails.isCompleted = true;


//         emit AmountWithdrawSuccessful(
//             _requestId,
//             requestDetails.description,
//             requestDetails.amount,
//             requestDetails.noOfVotes,
//             true,
//             requestDetails.reciptent
//         );

//     }

//     // @dev Get contract details
//     // @return all the project's details

//     function getProjectDetails() public view returns(
//     address payable projectStarter,
//     uint256 minContribution,
//     uint256  projectDeadline,
//     uint256 goalAmount, 
//     uint completedTime,
//     uint256 currentAmount, 
//     string memory title,
//     string memory desc,
//     State currentState,
//     uint256 balance
//     ){
//         projectStarter=creator;
//         minContribution=minimumContribution;
//         projectDeadline=deadline;
//         goalAmount=targetContribution;
//         completedTime=completeAt;
//         currentAmount=raisedAmount;
//         title=projectTitle;
//         desc=projectDes;
//         currentState=state;
//         balance=address(this).balance;
//     }

// }

pragma solidity ^0.8.0;

contract Project {
    // Project state
    enum State {
        Fundraising,
        Expired,
        Successful
    }

    struct WithdrawRequest {
        string description;
        uint256 amount;
        uint256 noOfVotes;
        mapping(address => bool) voters;
        bool isCompleted;
        address payable reciptent;
    }

    // Variables
    address payable public creator;
    address[] public trustees; // Addresses of the trustees
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
    event WithdrawRequestCreated(uint256 requestId, string description, uint256 amount, uint256 noOfVotes, bool isCompleted, address reciptent);
    event WithdrawVote(address voter, uint256 totalVote);
    event AmountWithdrawSuccessful(uint256 requestId, string description, uint256 amount, uint256 noOfVotes, bool isCompleted, address reciptent);
    event TrusteesAdded(address[] trustees);

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

    function setStateExpired() public {
        state = State.Expired;
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
        newRequest.noOfVotes = 0;
        newRequest.isCompleted = false;
        newRequest.reciptent = _reciptent;

        emit WithdrawRequestCreated(numOfWithdrawRequests, _description, _amount, 0, false, _reciptent);
        checkFundingCompleteOrExpire();
    }

    function voteWithdrawRequest(uint256 _requestId) public onlyTrustee() {
        WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
        require(!requestDetails.voters[msg.sender], 'You already voted!');
        requestDetails.voters[msg.sender] = true;
        requestDetails.noOfVotes += 1;
        emit WithdrawVote(msg.sender, requestDetails.noOfVotes);
    }

    function withdrawRequestedAmount(uint256 _requestId) public isCreator() {
        WithdrawRequest storage requestDetails = withdrawRequests[_requestId];
        require(requestDetails.isCompleted == false,'Request already completed');
        uint256 minVotesRequired = 3; // Set minimum votes required to 3
        require(requestDetails.noOfVotes >= minVotesRequired, 'Insufficient votes for this request');

        requestDetails.reciptent.transfer(requestDetails.amount);
        requestDetails.isCompleted = true;

        emit AmountWithdrawSuccessful(_requestId, requestDetails.description, requestDetails.amount, requestDetails.noOfVotes, true, requestDetails.reciptent);
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
