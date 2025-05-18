var btn = document.getElementById("btn");

        function leftClick() {
            document.getElementById("btn").style.left = "0";
            document.getElementById("adminBtn").classList.add("active");
            document.getElementById("devBtn").classList.remove("active");
        }

        function rightClick() {
            document.getElementById("btn").style.left = "130px";
            document.getElementById("devBtn").classList.add("active");
            document.getElementById("adminBtn").classList.remove("active");
        }
