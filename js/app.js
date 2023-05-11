if (navigator.onLine) {
    const msgInput = document.getElementById("endorsement");
    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("to");
    const submitBtn = document.getElementById("submit");
    const endorsementContainer = document.getElementById("endorsements");
    const form = document.getElementById("form");

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (form.checkValidity()) {
            addEndorsement();
        } else {
            form.reportValidity();
        }
    });

    const endorsements = JSON.parse(localStorage.getItem("endorsements")) || [];

    function addEndorsement() {
        const endorsement = {
            msg: msgInput.value,
            from: fromInput.value,
            to: toInput.value
        };

        endorsements.push(endorsement);
        localStorage.setItem("endorsements", JSON.stringify(endorsements));

        form.reset();

        renderEndorsements();
    }

    renderEndorsements();

    function renderEndorsements() {
        if (endorsements && endorsements.length > 0) {
            endorsementContainer.textContent = "";
            endorsements.forEach(endorsement => {
                const endorsementDiv = document.createElement("div");
                endorsementDiv.classList.add("endorsement");

                endorsementDiv.innerHTML = `
                    <h3>From: ${endorsement.from}</h3>
                    <p>${endorsement.msg}</p>
                    <h3>To: ${endorsement.to}</h3>
            `;

                endorsementContainer.appendChild(endorsementDiv);
            });
        } else {
            endorsementContainer.textContent = "No endorsements";
        }
    }

} else {
    document.getElementById("offline").style.display = "block";
}