interface Exam {
  id: number;
  name: string;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/exams")
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
    const code = (document.getElementById("code") as HTMLInputElement).value; // New code field
    fetch("http://localhost:3000/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        pc_number,
        exam_id: parseInt(exam_id),
        code,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Registration failed");
      })
      .then((data) => {
        chrome.storage.local.set(
          { student_id: data.student_id, registeredExams: data.exams },
          () => {
            alert("Registered successfully");
          }
        );
      })
      .catch(() => alert("Registration failed"));
  });

  document.getElementById("clear-btn")!.addEventListener("click", () => {
    chrome.storage.local.remove(["student_id", "registeredExams"], () => {
      alert("Registration cleared");
      window.location.reload();
    });
  });
});
