const getStations = () => {
  $.get('/api/stations', (response) => {
    if (response.statusCode !== 200) return
    const addCards = (stations) => {
      stations.forEach((station) => {
        const card = `
			<div class="col s12 m4">
				<div class="card">
				<div class="card-content">
					<span class="card-title">${station.stationName}</span>
					<p>${station.suburb}</p>
					<p>Connector: ${station.connectorType}</p>
					<p>Power: ${station.powerOutput} kW</p>
					<p>Status: ${station.available ? 'Available' : 'In Use'}</p>
				</div>
				</div>
			</div>`
        $('#card-container').append(card)
      })
    }
    addCards(response.data || [])
  })
}

function submitForm () {
  // Wire to POST /api/stations when the server exposes a create route.
}

$(document).ready(function () {
  $('.materialboxed').materialbox()
  $('#formSubmit').click(() => {
    submitForm()
  })
  getStations()
  $('.modal').modal()
})
