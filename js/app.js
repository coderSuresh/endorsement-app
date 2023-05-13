import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

let dbRef = ""
if (navigator.onLine) {
    const firebaseConfig = {
        databaseURL: "https://endorsement-app-4f276-default-rtdb.asia-southeast1.firebasedatabase.app/",
    }

    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    dbRef = ref(database, "/endorsements");
}

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

    endorsements.unshift(endorsement);

    if (navigator.onLine) {
        push(dbRef, endorsement);
    } else localStorage.setItem("endorsements", JSON.stringify(endorsements));

    form.reset();
    getEndorsements(endorsements);
}

getEndorsements(endorsements);

function getEndorsements() {
    // Listen for new endorsements
    if (navigator.onLine) {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val() ? Object.values(snapshot.val()) : [];

            if (data && data.length > 0) {
                renderEndorsements(data);
            } else {
                endorsementContainer.textContent = "No endorsements";
            }
        });
    } else {
        renderEndorsements(endorsements);
    }
}

// push local data to firebase
if (endorsements.length) {
    if (confirm("You have endorsements in local storage. Do you want to push them to the database?")) {
        endorsements.forEach((endorsement, i) => {
            if (endorsement.msg != "" ||
                endorsement.from != "" ||
                endorsement.to != "") {
                push(dbRef, endorsement)
            }
        });
        localStorage.removeItem("endorsements");
    }
}

function renderEndorsements(endorsements) {
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