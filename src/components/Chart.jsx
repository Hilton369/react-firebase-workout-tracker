import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Chart(props) {
    const selectedExercise = props.selectedExercise;
    const chartX = props.chartX;
    const chartY = props.chartY;
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                // display: true,
                text: selectedExercise,
            },
        },
    };
    const data = {
        labels: chartX,
        datasets: [
            {
                label: "Training Volume",
                data: chartY,
                borderColor: "#0091FF",
                backgroundColor: "#0091FF"
            },
        ],
    };

    function closeChart() {
        props.setChartBool(false);
    }

    return (
        <>
            <div className="popup">
                <div className="popup-inner">
                    <h4>Training Volume Chart</h4>
                    <p>
                        This chart graphs the total workout volume (reps x
                        weight x sets) for each workout in the selected
                        exercise.
                    </p>
                    <div className="chart-container">
                        <Line options={options} data={data} />
                    </div>
                    <button onClick={closeChart}>Close</button>
                </div>
            </div>
        </>
    );
}

export default Chart;
