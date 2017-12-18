/* Interactive Canvas App
  How app works
    - define a wrapper obj Canvas.
    - Use Fabric to define the Obj you wanna draw.
    - Add it to the canvas.
  By: mohammed@redapesolutions.com
*/

$(document).ready(function () {
// global settings and variables
  var canvas = this.__canvas = new fabric.Canvas('main_canvas')
  fabric.Object.prototype.transparentCorners = false
  canvas.counter = 0
  // var newleft = 0
  // var radius = 500
  canvas.setHeight(500)
  canvas.setWidth(500)

// TODO: need to rewrite all using fabric event system.. this is not good :(
  // working with text
  $('#addTxt').click((txt) => {
    txt = window.prompt('please enter text', '', txt)
    var text = new fabric.IText(txt, {
      left: (Math.random() * 100) + 200,
      top: (Math.random() * 100) + 200,
      fontSize: $('#fntSize :selected').text()})
    canvas.add(text).setActiveObject(text)
    $('#font-options').removeClass('hidden') // show a goofy message for user
    canvas.isDrawingMode = false // stop drawing
    updateModifications(true) // update the canvas state
    canvas.counter++ // increasring count to track changes on canvas
  })

  /* now let's customize fonts */

  // control font family
  $('#fntFamily').change(() => {
    element = canvas.getActiveObject()
    var selectedFont = $('#fntFamily :selected').text()
    element.fontFamily = selectedFont
  })

  // control font size
  $('#fntSize').change(() => {
    element = canvas.getActiveObject()
    var selectedFont = $('#fntSize :selected').text()
    element.fontSize = selectedFont
  })

  // control font style 'Bold'
  $('#fntBold').change(() => {
    // work in progress
  })

  // control font style 'underlined'
  $('#fntUnderline').change(() => {
    // still work in progress
  })

  // edit selected text
  $('#editText').click((newText) => {
    newText = window.prompt('New Text here', '', newText)
    element = canvas.getActiveObject()
    element.setText(newText)
    canvas.renderAll()
    updateModifications(true) // updating the state
    canvas.counter++ // increasring count to track changes on canvas
  })

  // edit selected text font color
  $('#txtColor').click((jscolor) => {
    newColor = canvas.getActiveObject().setColor('#' + jscolor)
    console.log(newColor)
    // element = canvas.getActiveObject()
    // element.setColor(newColor)
    // canvas.renderAll()
  })

  /* that is all for font customization */

  // Start drawing free hand
  $('#drawShape').click(() => {
    canvas.isDrawingMode = true
    canvas.on('mouse:move', function (options) {
      $('#mouseXcord').html(options.e.clientX)
      $('#mouseYcord').html(options.e.clientY)
      canvas.on('mouse:down', function (options) {
        $('#user-goodluck').removeClass('hidden')
        updateModifications(true) // updating the state
        canvas.counter++ // increasring count to track changes on canvas
      })
      // console.log(options.e.clientX, options.e.clientY)
    })
  })

  // handle uploading image to canvas
  $('#uploadImg').change((e) => {
    canvas.isDrawingMode = false // stop drawing
    // console.log(e)
    var file = e.target.files[0]
    var reader = new FileReader()
    reader.onload = function (f) {
      var data = f.target.result
      fabric.Image.fromURL(data, function (img) {
        var oImg = img.set({left: 0, top: 0, angle: 0, width: 100, height: 100}).scale(0.9)
        canvas.add(oImg).renderAll()
        var a = canvas.setActiveObject(oImg)
        var dataURL = canvas.toDataURL({format: 'png', quality: 0.8})
      })
    }
    reader.readAsDataURL(file)
    updateModifications(true) // updating the state
    canvas.counter++ // increasring count to track changes on canvas
  })

  // sharing after finishing
  $('#share').click(() => {
    canvas.deactivateAll().renderAll()
    window.open(canvas.toDataURL('png'))
  })

  // clearing all elements on canvas
  $('#clearCanvas').click(() => {
    // simply clear the canvas
    canvas.clear()
    $('#changeBg').css('background-color', '#FFFFFF')
    canvas.isDrawingMode = false // stop drawing
    $('#font-options').addClass('hidden') // hide font options panel
    updateModifications(true) // updating the state
    canvas.counter++ // increasring count to track changes on canvas
  })

  // delete an element on canvas
  $('#deleteElement').click((element) => {
    canvas.isDrawingMode = false // stop drawing
    element = canvas.getActiveObject()
    canvas.remove(element)
    // updating the state
    updateModifications(true)
    canvas.counter++
  })

  // change canvas background
  $('#control-div').mousemove(() => {
    // console.log('event happening now')
    // accessing canvas background property and rerendering canvas obj
    canvas.backgroundColor = $('#changeBg').css('background-color')
    canvas.renderAll()
  })

  // Work in porgress function for the unfinished stuff
  $('.inprogress').click(() => {
    alert('This Feature Still under developement')
    canvas.isDrawingMode = false // stop drawing
  })

  // tracking app state for redo and undo stuff
  var state = []
  var mods = 0
  canvas.on(
      'object:modified', function () {
        updateModifications(true)
      },
      'object:added', function () {
        updateModifications(true)
      })

  function updateModifications (savehistory) {
    // serializing entire canvas into json format and pushing it to the state
    if (savehistory === true) {
      myjson = JSON.stringify(canvas)
      state.push(myjson)
    }
  }

  undo = function undo () {
    // checking to see if modification are less than the state which means something was removed.
    if (mods < state.length) {
      canvas.clear().renderAll()
      canvas.loadFromJSON(state[state.length - 1 - mods - 1])
      canvas.renderAll()
      // console.log('geladen ' + (state.length - 1 - mods - 1))
      // console.log('state ' + state.length)
      mods += 1
      // console.log('mods ' + mods)
    }
  }

  redo = function redo () {
    // just checking to see if any modification are done.
    if (mods > 0) {
      canvas.clear().renderAll()
      canvas.loadFromJSON(state[state.length - 1 - mods + 1])
      canvas.renderAll()
      // console.log('geladen ' + (state.length - 1 - mods + 1))
      mods -= 1
      // console.log('state ' + state.length)
      // console.log('mods ' + mods)
    }
  }

  // clearcan = function clearcan () {
  //   canvas.clear().renderAll()
  //   newleft = 0
  // }
})

// scraps ...
    // $('#changeBg').bind({
    //   click: function () {
    //     canvas.backgroundColor = $('#changeBg').css('background-color')
    //     alert($(this).text())
    //   },
    //   mouseleave: function () {
    //     canvas.backgroundColor = $('#changeBg').css('background-color')
    //   }
    // })

// var imgs = ['./assets/rose.jpg', './assets/pyramid.jpg', './assets/majestic_cat.jpg', './assets/sleepy_cat.jpg', './assets/small_cat.jpg']
  // working with images
  // $('#addImg').click(() => {
  //   fabric.Image.fromURL(imgs[Math.floor(Math.random() * imgs.length)], function (img) {
  //     img.scale(0.9).set({
  //       left: (Math.random() * 100) + 100,
  //       top: (Math.random() * 100) + 100,
  //       angle: -(Math.random() * 100),
  //       clipTo: function (ctx) {
  //         ctx.arc(0, 0, radius, 0, Math.PI * 2, true)
  //       }
  //     })
  //     canvas.add(img)
  //   })
  // })

    // (function animate () {
    //   fabric.util.animate({
    //     startValue: Math.round(radius) === 50 ? 50 : 300,
    //     endValue: Math.round(radius) === 50 ? 300 : 50,
    //     duration: 1000,
    //     onChange: function (value) {
    //       radius = value
    //       canvas.renderAll()
    //     },
    //     onComplete: animate
    //   })
    // })()

    // window.open(canvas.toDataURL('png'), '', 'Share image', 'toolbar=yes, location=no, directories=no, status=no, scrollbars=yes, resizable=yes, width=780, height=200, top=' + (screen.height - 400) + ', left=' + (screen.width - 840))
    // win.document.body.innerHTML = 'Share this cool image with friends and family'
