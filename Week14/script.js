let gravityOn = false;

function toggleGravity() {
    gravityOn = !gravityOn;
    document.getElementById("statusText").innerText =
        gravityOn ? "Gravity: ON" : "Gravity: OFF";
}
