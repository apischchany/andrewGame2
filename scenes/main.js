const MOVE_SPEED = 200
const INVADER_SPEED = 300
let CURRENT_SPEED = INVADER_SPEED
const LEVEL_DOWN = 500
const TIME_LEFT = 20
const BULLET_SPEED = 500

layer(['obj', 'ui'], 'obj')

addLevel ([
  '!^^^^^^^^^^    &',
  '!^^^^^^^^^^    &',
  '!^^^^^^^^^^    &',
  '! $      $     &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
  '!              &',
], {
  width: 30,
  height: 22,
  '^' : [sprite('space-invader'), 'space-invader'],
  '$' : [sprite('space-invader-boss'), 'space-invader'],
  '!' : [sprite('wall'), 'left-wall'],
  '&' : [sprite('wall'), 'right-wall'],
})

const player = add([
  sprite('space-ship'),
  pos(width() / 4, height() / 1.1),
  origin('center')
])


keyDown('left', () => {
  player.move(-MOVE_SPEED, 0)
  })
keyDown('right', () => {
  player.move(MOVE_SPEED, 0)
})

function spawnBullet(p) {
  add ([
    rect(4,18),
    pos(p),
    origin('center'), 
    color(0.5,0.5,1),
    'bullet'
  ])
  }

keyPress ('space', () => {
spawnBullet(player.pos.add(8,-20)),
spawnBullet(player.pos.add(-10,-20))
})


action('bullet', (b) => {
  b.move(0, -BULLET_SPEED)
  if (b.pos.y < 0) {
    destroy(b)
  }
})

const score = add([
  text('0'),
  pos(500,50),
  layer('ui'),
  scale(5),
  {
    value: 0,
  }
])


const timer = add([
  text('0'),
  pos(500, 100),
  layer('ui'),
  scale(5),
  {
    time: TIME_LEFT,
  },
])

timer.action(() => 
{timer.time -= dt() 
timer.text = timer.time.toFixed(2)
if (timer.time <= 0) {
  go('lose', {score: score.value })
} 
})



action('space-invader', (s) => {
  s.move(CURRENT_SPEED, 0)
})

collides('space-invader', 'right-wall', () => {
  CURRENT_SPEED = -INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

collides('bullet', 'space-invader', (b,s) => {
  camShake(10),
  destroy(b),
  destroy(s),
  score.value++
  score.text = score.value
})

collides('space-invader', 'left-wall', () => {
  CURRENT_SPEED = INVADER_SPEED
  every('space-invader', (s) => {
    s.move(0, LEVEL_DOWN)
  })
})

player.overlaps('space-invader', () => {
  go('lose', {score: score.value})
})

action('space-invader', (s) => {
  if (s.pos.y >= height()/1.1) {
    go('lose', {score: score.value})
  }
})
