// Intel Sustainability Summit Check-In App

// The attendance goal for the event
const attendanceGoal = 50;

// Load saved attendance count from localStorage
let attendeeCount = Number(localStorage.getItem("attendeeCount")) || 0;

// Load saved team counts
let teamCounts = JSON.parse(localStorage.getItem("teamCounts"));

if (!teamCounts) {
  teamCounts = {
    water: 0,
    zero: 0,
    power: 0,
  };
}

// Load saved attendee list
let attendees = JSON.parse(localStorage.getItem("attendees"));

if (!attendees) {
  attendees = [];
}

// Get HTML elements
const checkInForm = document.getElementById("checkInForm");

const attendeeCountDisplay = document.getElementById("attendeeCount");

const progressBar = document.getElementById("progressBar");

const greeting = document.getElementById("greeting");

const waterCountDisplay = document.getElementById("waterCount");

const zeroCountDisplay = document.getElementById("zeroCount");

const powerCountDisplay = document.getElementById("powerCount");

const attendeeList = document.getElementById("attendeeList");

const celebration = document.getElementById("celebration");

const waterCard = document.getElementById("waterCard");

const zeroCard = document.getElementById("zeroCard");

const powerCard = document.getElementById("powerCard");

// Convert the team value into the full team name
function getTeamName(team) {
  if (team === "water") {
    return "Team Water Wise";
  } else if (team === "zero") {
    return "Team Net Zero";
  } else if (team === "power") {
    return "Team Renewables";
  }

  return "";
}

// Save progress in localStorage
function saveProgress() {
  localStorage.setItem("attendeeCount", attendeeCount);

  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));

  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Display the attendee list
function displayAttendees() {
  attendeeList.innerHTML = "";

  // If nobody has checked in yet
  if (attendees.length === 0) {
    const emptyMessage = document.createElement("p");

    emptyMessage.textContent = "No attendees checked in yet.";

    emptyMessage.className = "empty-message";

    attendeeList.appendChild(emptyMessage);

    return;
  }

  // Create one row for every attendee
  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];

    const attendeeItem = document.createElement("div");

    attendeeItem.className = "attendee-item";

    const attendeeName = document.createElement("span");

    attendeeName.textContent = `👤 ${attendee.name}`;

    const attendeeTeam = document.createElement("span");

    attendeeTeam.textContent = getTeamName(attendee.team);

    attendeeItem.appendChild(attendeeName);

    attendeeItem.appendChild(attendeeTeam);

    attendeeList.appendChild(attendeeItem);
  }
}

// Remove the winner highlight from all teams
function removeWinnerHighlight() {
  waterCard.classList.remove("winner");
  zeroCard.classList.remove("winner");
  powerCard.classList.remove("winner");
}

// Find the winning team
function getWinningTeam() {
  const highestCount = Math.max(
    teamCounts.water,
    teamCounts.zero,
    teamCounts.power,
  );

  let winners = [];

  if (teamCounts.water === highestCount) {
    winners.push("water");
  }

  if (teamCounts.zero === highestCount) {
    winners.push("zero");
  }

  if (teamCounts.power === highestCount) {
    winners.push("power");
  }

  return winners;
}

// Celebration LevelUp
function showCelebration() {
  removeWinnerHighlight();

  const winners = getWinningTeam();

  celebration.style.display = "block";

  // If there is only one winning team
  if (winners.length === 1) {
    const winningTeam = winners[0];

    celebration.innerHTML = `🎉 Attendance goal reached! 🎉<br>
      <strong>${getTeamName(winningTeam)}</strong>
      has the highest turnout!`;

    // Highlight the winner
    if (winningTeam === "water") {
      waterCard.classList.add("winner");
    } else if (winningTeam === "zero") {
      zeroCard.classList.add("winner");
    } else if (winningTeam === "power") {
      powerCard.classList.add("winner");
    }
  } else {
    // Handle a tie
    let winnerNames = [];

    for (let i = 0; i < winners.length; i++) {
      winnerNames.push(getTeamName(winners[i]));

      if (winners[i] === "water") {
        waterCard.classList.add("winner");
      }

      if (winners[i] === "zero") {
        zeroCard.classList.add("winner");
      }

      if (winners[i] === "power") {
        powerCard.classList.add("winner");
      }
    }

    celebration.innerHTML = `🎉 Attendance goal reached! 🎉<br>
      <strong>It's a tie between
      ${winnerNames.join(" and ")}!</strong>`;
  }
}

// Update everything displayed on the page
function updateDisplay() {
  // Update total attendance
  attendeeCountDisplay.textContent = attendeeCount;

  // Update team attendance
  waterCountDisplay.textContent = teamCounts.water;

  zeroCountDisplay.textContent = teamCounts.zero;

  powerCountDisplay.textContent = teamCounts.power;

  // Calculate progress percentage
  let progressPercentage = (attendeeCount / attendanceGoal) * 100;

  // Stop progress bar from going past 100%
  if (progressPercentage > 100) {
    progressPercentage = 100;
  }

  // Update progress bar
  progressBar.style.width = `${progressPercentage}%`;

  // Update attendee list
  displayAttendees();

  // Check if attendance goal was reached
  if (attendeeCount >= attendanceGoal) {
    showCelebration();
  } else {
    celebration.style.display = "none";
    removeWinnerHighlight();
  }
}

// Listen for the check-in form submission
checkInForm.addEventListener("submit", function (event) {
  // Stop the page from refreshing
  event.preventDefault();

  // Get attendee name
  const attendeeName = document.getElementById("attendeeName").value.trim();

  // Get selected team
  const selectedTeam = document.getElementById("teamSelect").value;

  // Make sure a name and team were entered
  if (attendeeName === "" || selectedTeam === "") {
    return;
  }

  // Increase total attendance by 1
  attendeeCount = attendeeCount + 1;

  // Increase selected team's count
  teamCounts[selectedTeam] = teamCounts[selectedTeam] + 1;

  // Create attendee object
  const newAttendee = {
    name: attendeeName,
    team: selectedTeam,
  };

  // Add attendee to attendee list
  attendees.push(newAttendee);

  // Get full team name
  const fullTeamName = getTeamName(selectedTeam);

  // Show personalized greeting
  greeting.textContent = `Welcome, ${attendeeName}! You're checked in with ${fullTeamName}.`;

  greeting.className = "success-message";

  greeting.style.display = "block";

  // Save progress
  saveProgress();

  // Update the page
  updateDisplay();

  // Reset form
  checkInForm.reset();

  // Put cursor back in the name input
  document.getElementById("attendeeName").focus();
});

// Show saved progress when page loads
updateDisplay();
