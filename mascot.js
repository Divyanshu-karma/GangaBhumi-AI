const mascot = document.querySelector(".ai-mascot");

if (mascot) {
    setInterval(() => {
        mascot.animate(
            [
                { transform: "translateY(0)" },
                { transform: "translateY(-6px) rotate(1deg)" },
                { transform: "translateY(0)" }
            ],
            {
                duration: 1600,
                easing: "ease-in-out"
            }
        );
    }, 18000); // once every ~18 seconds
}
