// const parentList = document.getElementById("parent-list");
// parentList.addEventListener("click", (event) => {
//     if (event.target.match("li")) {
//         event.target.style.textDecoration="line-through"
//     }
// })


// SELECT order_status, SUM(CASE WHEN DATE_TRUNC('month', created_at) = '2024-09-01' THEN 1 ELSE 0 END) AS "SEP", SUM(CASE WHEN DATE_TRUNC('month', created_at) = '2024-10-01' THEN 1 ELSE 0 END) AS "OCT", SUM(CASE WHEN DATE_TRUNC('month', created_at) = '2024-11-01' THEN 1 ELSE 0 END) AS "NOV" FROM sales WHERE created_at >= '2024-09-01' AND created_at <= '2024-12-31' GROUP BY order_status;