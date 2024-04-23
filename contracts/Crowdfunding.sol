//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './Project.sol';

contract Crowdfunding{

// [X] Semua orang dapat membuat kampanye donasi
// [X] Get All project list
// [X]  contribute amount

event ProjectStarted(
    address projectContractAddress ,
    address creator,
    uint256 minContribution,
    uint256 projectDeadline,
    uint256 goalAmount,
    uint256 currentAmount,
    uint256 noOfContributors,
    string title,
    string desc,
    uint256 currentState
);

event ContributionReceived(
   address projectAddress,
   uint256 contributedAmount,
   address indexed contributor
);

 Project[] private projects;

  // @dev Anyone can start a fund rising
 // @return null

 function createProject(
    uint256 minimumContribution,
    uint deadline,
    uint256 targetContribution,
    string memory projectTitle,
    string memory projectDesc
 ) public {

   deadline = deadline;
   

   Project newProject = new Project(msg.sender, minimumContribution,deadline,targetContribution,projectTitle,projectDesc);
   projects.push(newProject);
 
 emit ProjectStarted(
    address(newProject) ,
    msg.sender,
    minimumContribution,
    deadline,
    targetContribution,
    0,
    0,
    projectTitle,
    projectDesc,
    0
 );

 }

 // @dev Get projects list
// @return array

// function updateProjectStates() public {
//     for (uint256 i = 0; i < projects.length; i++) {
//         if (block.timestamp*1000 > (projects[i].deadline()) && (projects[i]).state() == Project.State.Fundraising) {
//             (projects[i]).setStateExpired();
//         }
//     }
// }

function returnAllProjects() external view returns(Project[] memory){
   return projects;
}


// @dev User can contribute
// @return null


function contribute(address _projectAddress) public payable{

   uint256 minContributionAmount = Project(_projectAddress).minimumContribution();
   Project.State projectState = Project(_projectAddress).state();
   require(projectState == Project.State.Fundraising,'Invalid state');
   require(msg.value >= minContributionAmount,'Contribution amount is too low !');
   // Call function
   Project(_projectAddress).contribute{value:msg.value}(msg.sender);
   // Trigger event 
   emit ContributionReceived(_projectAddress,msg.value,msg.sender);
}

   // function changeState(Project[] memory projectList) public returns(Project[] memory){
   //    for(uint i = 0; i < projectList.length; i++){
   //       projectList[i].setState(Project.State.Expired);
   //       //   Project.State projectState = projectList[i].state();
   //       if(projectList[i].state() == Project.State.Fundraising){
   //          projectList[i].setState(Project.State.Expired);
   //       }
   //    }
   //    return projectList;
   // }
}