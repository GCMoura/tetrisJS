document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid")
    let squares = Array.from(document.querySelectorAll(".grid div")) //cada quadrado
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    var speedGame = 500
    const colors = [
        '#e4cc37',//orange
        '#f71735', //red
        '#693668', //purple
        '#8fc93a', //green
        '#f7c1bb' //pink
    ]
     
    //the tretominoes and this shapes

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]


      const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

      let currentPosition = 4
      let currentRotation = 0

      //randomly select a Tetromino and its first rotation
      let random = Math.floor(Math.random()*theTetrominoes.length)
      let current = theTetrominoes[random][currentRotation]

      //draw the tetromino
      function draw(){ //put de class in each square
          current.forEach(index => {
              squares[currentPosition + index].classList.add('tetromino')
              squares[currentPosition + index].style.backgroundColor = colors[random]
          })
      }

      draw()

      //undraw the tetromino
      function undraw(){
          current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
          })
      }

      //make the tetromino move down every second
      //timeId = setInterval(moveDown, 500)

      //assign functions to keyCodes
      function control(e){
          if(e.keyCode === 37){
              moveLeft()
          } else if (e.keyCode === 38){
              rotate()
          } else if (e.keyCode === 39) {
              moveRight()
          } else if (e.keyCode === 40){
              moveDown()
          }
      }

      function controlButton(){
        document.getElementById('left').addEventListener('click', moveLeft)
        document.getElementById('up').addEventListener('click', rotate)
        document.getElementById('right').addEventListener('click', moveRight)
        document.getElementById('down').addEventListener('click', moveDown)
      }
      
      document.addEventListener('keyup', control)
      document.addEventListener('click', controlButton)

      //move down function
      function moveDown(){ 
          undraw()
          currentPosition += width
          draw()
          freeze()
      }

    //freeze function
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            addScore()
            gameOver()
        }
    }

    //move the tetromino left, unless is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) currentPosition -=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          currentPosition +=1
        }
        draw()
      }

    //move the tetromino right, unless is at the edge or there is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
        if(!isAtRightEdge) currentPosition +=1
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
          currentPosition -=1
        }
        draw()
      }

    ///FIX ROTATION OF TETROMINOS AT THE EDGE 
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

    //rotate the tetromino
    function rotate(){
        undraw()
        currentRotation++

        //if the current rotation gets to 4, make it go back to 0
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            timerId = setInterval(moveDown, speedGame)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            
        }
    })

    //add score
    function addScore(){
        for(let i = 0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
                if(score % 50 == 0){
                  speedGame -= 30
                  timerId = setInterval(moveDown, speedGame)
                }
            }
        }
    }

    //game over
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            scoreDisplay.style.color = "red"
            startBtn.innerText = 'Restart'
            startBtn.addEventListener('click', () => {
              window.location.reload(true)
            })
            clearInterval(timerId)
        }
    }
})


