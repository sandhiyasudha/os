// Display Student Name
document.getElementById("studentName").textContent = localStorage.getItem("username");

// Subjects data
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

// DOM elements
const subjectInput = document.getElementById("subjectInput");
const totalChapters = document.getElementById("totalChapters");
const subjectList = document.getElementById("subjectList");
const recommendationText = document.getElementById("recommendationText");
const motivationText = document.getElementById("motivationText");
const plannerOutput = document.getElementById("plannerOutput");
const availableHoursInput = document.getElementById("availableHours");
const availableDaysInput = document.getElementById("availableDays");

// Add Subject
document.getElementById("addSubject").addEventListener("click", () => {
  const name = subjectInput.value.trim();
  const total = parseInt(totalChapters.value);
  if(name && total > 0) {
    subjects.push({ name, total, completed: 0 });
    localStorage.setItem("subjects", JSON.stringify(subjects));
    subjectInput.value = "";
    totalChapters.value = "";
    renderSubjects();
    updateChart();
    showRecommendation();
  }
});

// Render Subject List
function renderSubjects() {
  subjectList.innerHTML = "";
  subjects.forEach((sub, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${sub.name}</b> - ${sub.completed}/${sub.total} chapters completed
      <button onclick="markComplete(${i})">+1 Complete</button>`;
    subjectList.appendChild(div);
  });
}

// Mark chapter complete (pure function)
function markComplete(i) {
  subjects = subjects.map((s,index) =>
    index === i && s.completed < s.total ? {...s, completed: s.completed+1} : s
  );
  localStorage.setItem("subjects", JSON.stringify(subjects));
  renderSubjects();
  updateChart();
  showRecommendation();
}

// Chart.js for progress
const ctx = document.getElementById("progressChart");
let chart;
function updateChart() {
  const labels = subjects.map(s => s.name);
  const data = subjects.map(s => (s.completed/s.total)*100);
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets:[{ label:"Progress (%)", data, backgroundColor:"#4a90e2"}] },
    options: { scales:{ y:{ beginAtZero:true, max:100 } } }
  });
}

// Recommendation
function showRecommendation() {
  if(subjects.length ===0) { recommendationText.textContent="Add subjects to get recommendations!"; return; }
  const lowest = subjects.reduce((a,b)=>(a.completed/a.total)<(b.completed/b.total)?a:b);
  recommendationText.textContent = `Focus more on ${lowest.name}`;
}

// Motivation
const quotes = ["Small steps daily lead to big success!","Discipline is stronger than motivation.","Stay consistent and results will follow.","Don’t watch the clock; do what it does — keep going!"];
function showMotivation() {
  motivationText.textContent = quotes[Math.floor(Math.random()*quotes.length)];
}
showMotivation();
renderSubjects();
updateChart();
showRecommendation();

// Logout
document.getElementById("logout").addEventListener("click", ()=>{
  localStorage.removeItem("username");
  localStorage.removeItem("subjects");
  window.location.href="login.html";
});

// Generate Timetable with skipped day handling
document.getElementById("generatePlanner").addEventListener("click", () => {
  const hours = parseInt(availableHoursInput.value);
  const days = parseInt(availableDaysInput.value);
  if(!hours || !days) { alert("Enter valid hours and days"); return; }

  let timetable = [];
  let remainingSubjects = subjects.map(s => ({...s}));

  for(let day=1; day<=days; day++) {
    let dayPlan = `Day ${day}: `;
    let remainingHours = hours;

    remainingSubjects.forEach(sub => {
      if(sub.completed < sub.total && remainingHours>0) {
        const chaptersToStudy = Math.min(sub.total-sub.completed, remainingHours);
        sub.completed += chaptersToStudy;
        remainingHours -= chaptersToStudy;
        dayPlan += `${sub.name}: ${chaptersToStudy} chapter(s) | `;
      }
    });

    timetable.push(dayPlan.slice(0,-3));
  }

  plannerOutput.innerHTML = timetable.join("<br>");
  localStorage.setItem("subjects", JSON.stringify(remainingSubjects));
  renderSubjects();
  updateChart();
  showRecommendation();
});