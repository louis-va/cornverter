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
        fill: true,
        backgroundColor: 'rgba(246, 244, 238, 0.05)',
        borderColor: 'rgba(246, 244, 238, 0.8)',
        borderWidth: 3,
        tension: 0,
        pointRadius: 0
      }]
    }
  
    const options = {
      aspectRation: 1/2,
      animation: false,
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'value'
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false,
          titleFont: {
            family: 'IBM Plex Mono',
            size: 12,
            color: 'rgb(246, 244, 238)'
          },
          bodyFont: {
            family: 'IBM Plex Mono',
            size: 10,
            color: 'rgb(246, 244, 238)'
          },
          backgroundColor: 'rgba(34, 24, 3, 1)',
          displayColors: false
        },
        legend: {
          display: false
        }
      },  
      scales: {
        x: {
          border: {
            display: false
          },
          grid: {
            color: 'rgba(246, 244, 238, .05)'
          },
          ticks: {
            color: 'rgba(246, 244, 238, .5)',
            maxTicksLimit: 4,
            font: {
              family: 'IBM Plex Mono',
              size: 10
            },
          }
        },
        y: {
          border: {
            display: false
          },
          grid: {
            color: 'rgba(246, 244, 238, .1)'
          },
          ticks: {
            color: 'rgba(246, 244, 238, .5)',
            maxTicksLimit: 4,
            font: {
              family: 'IBM Plex Mono',
              size: 10
            },
            callback: function(val, index) {
              return '$' + this.getLabelForValue(val)
            }
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