document.querySelectorAll('input').forEach(input => {
  input.addEventListener('focus', function(e) {
    e.target.select()
  })
})

document.getElementById('form').onsubmit = (e) => {
  e.preventDefault()
  parent.postMessage({
    pluginMessage: {
      type: 'poisson',
      distance: parseInt(document.getElementById('distance').value) || 10,
      rotation: document.getElementById('rotation').checked
    }
  }, '*')
}