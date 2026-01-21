import { useEffect, useState } from "react";
import API from "../api/axios";


export default function HabitList() {
const [habits, setHabits] = useState([]);


useEffect(() => {
API.get("/tasks").then(res => setHabits(res.data));
}, []);


return (
<ul>
{habits.map(h => <li key={h._id}>{h.habitName}</li>)}
</ul>
);
}