interface Exam {
  id: number;
  name: string;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://your-api-url/api/exams")
    .then((res) => res.json())
    .then((exams: Exam[]) => {
      const select = document.getElementById(
        "exam-select"
      ) as HTMLSelectElement;
      exams.forEach((exam) => {
        const option = document.createElement("option");
        option.value = exam.id.toString();
        option.textContent = exam.name;
        select.appendChild(option);
      });
    });

  document.getElementById("register-btn")!.addEventListener("click", () => {
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const pc_number = (document.getElementById("pc_number") as HTMLInputElement)
      .value;
    const exam_id = (
      document.getElementById("exam-select") as HTMLSelectElement
    ).value;
    fetch("https://your-api-url/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pc_number, exam_id: parseInt(exam_id) }),
    })
      .then((res) => res.json())
      .then((data) => {
        chrome.storage.local.set(
          { student_id: data.student_id, registeredExams: data.exams },
          () => {
            alert("Registered successfully");
          }
        );
      });
  });
});
