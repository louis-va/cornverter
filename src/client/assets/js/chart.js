import Chart from 'chart.js/auto';

(() => {
  const canvas = document.getElementById('chart')

  function getDataPoints() {
    fetch('/api/corn-price', {method: 'GET'})
      .then(response => response.json())
      .then(data => {displayChart(data.data.cornPrice)})
      .catch((error) => {console.error(error)})
  }

  function displayChart(dataPoints) {
    const data = {
      datasets: [{
        label: 'Price (USD)',
        data: dataPoints,
        fill: false,
        borderColor: 'rgba(246, 244, 238, 0.8)',
        tension: 0.4,
        pointRadius: 0
      }]
    }
  
    const options = {
      aspectRatio: 2/1,
      animation: false,
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'value'
      },
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          axis: {
            color: 'rgba(246, 244, 238, 0.1)'
          },
          grid: {
            color: 'rgba(246, 244, 238, 0.1)'
          },
          ticks: {
            color: 'rgba(246, 244, 238, 0.3)',
            maxTicksLimit: 4
          }
        },
        y: {
          axis: {
            color: 'rgba(246, 244, 238, 0.1)'
          },
          grid: {
            color: 'rgba(246, 244, 238, 0.1)'
          },
          ticks: {
            color: 'rgba(246, 244, 238, 0.3)',
            maxTicksLimit: 5
          }
        }
      }
    };
  
    new Chart(canvas, {
      type: "line",
      data: data,
      options: options
    });

    canvas.classList.remove('loading')
  }

  getDataPoints()
})();