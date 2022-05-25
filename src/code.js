import * as poissonDiscSampler from 'poisson-disc-sampler'

const FRAME = 'FRAME'

// start plugin
figma.showUI(__html__, { width: 420, height: 45 })

// create poisson
function createPoisson(msg) {
  if (msg.type === 'poisson') {
    const distance = parseInt(msg.distance)
    const rotation = msg.rotation
    let children = []
    // get the current selected element
    let selection = figma.currentPage.selection[0]
    // end if no selected element or if selected element isn't a frame
    if (!selection || selection.type !== FRAME) {
      return 'A single frame must be selected in order for the plugin to run.'
    }
    // generate poisson array
    const sampler = poissonDiscSampler(selection.width, selection.height, distance)
    let sample
    const points = []
    while ((sample = sampler())) {
      points.push({ x: sample[0], y: sample[1] })
    }
    // if the selected frame has no children, create an ellipse
    if (selection.children.length === 0) {
      let ellipse = figma.createEllipse()
      ellipse.resize(10, 10)
      selection.appendChild(ellipse)
      ellipse.x = selection.width / 2 - 5
      ellipse.y = selection.height / 2 - 5
      selection = figma.currentPage.selection[0]
    }
    // create new frame
    const frame = figma.createFrame()
    frame.name = 'Poisson'
    frame.resize(selection.width, selection.height)
    frame.x = selection.x + selection.width + 20
    frame.y = selection.y
    // clone and append children
    for (let i = 0; i < points.length; i++) {
      let index = Math.floor(Math.random() * selection.children.length)
      let child = selection.children[index].clone()
      frame.appendChild(child)
      child.x = child.width / -2
      child.y = child.height / -2
      let angle = rotation ? Math.random() * 2 * Math.PI : 0
      let sine = Math.sin(angle)
      let cosine = Math.cos(angle)
      let x = points[i].x - (Math.cos(angle - (Math.PI / 4)) * Math.sqrt(0.5) * child.width)
      let y = points[i].y + (Math.sin(angle - (Math.PI / 4)) * Math.sqrt(0.5) * child.height)
      child.relativeTransform = [
        [cosine, sine, x],
        [-sine, cosine, y]
      ]
    }
  }
}


// on message
figma.ui.onmessage = msg => {
  // run plugin and capture errors
  let message = createPoisson(msg)
  // end plugin
  figma.closePlugin()
}