let player;
let playerImage1, playerImage2;
let chao;
let gravidade = 20;
let tapForce = -3
let tubos;
let sensores;
let gameOver = false
let restart, btRestart

let pontos = 0


function preload(){
  playerImage1 = loadImage('voando1.png')
  playerImage2 = loadImage('voando2.png');
  btRestart = loadImage('restart.png')
}

function setup() {
  createCanvas(600, 400);
 
  player = createSprite(100, height/2)
  player.addImage(playerImage1)
  player.scale = 0.1
  player.rotation = 0

  chao = createSprite(width/2,410,600,10)
  chao.collider = 'static'
  
  tubos = new Group()
  tubos.color = 'green'
  tubos.collider = 'kinematic'
  
  sensores = new Group()
  sensores.color = 'red'
  sensores.collider = 'kinematic'
  
  restart = createSprite(width / 2, 250, 100,50)
  restart.collider = 'static'
  restart.addImage(btRestart)
  restart.visible = false
  
  gerarTubos()
  
  world.gravity.y = gravidade;

}

function draw() {
  background(135, 206, 250);
  
  // Mostrar pontuação
  textSize(32);
  fill(255);
  text(`Pontuação: ${pontos}`, 10, 30);
  
  if(gameOver == false){
    movimentoPlayer();
    movimentoTubos();
    movimentoSensores()
    verificaGameOver()
  }else{
    stopGame()
  }
  
  // Verificar se o botão de restart foi clicado e está visível
  if (restart.visible && restart.mouse.presses()){
    reiniciarJogo()
  }
  
  if (restart.visible && restart.mouse.hovering()){
    mouse.cursor = 'grab'
  }
  else mouse.cursor = 'default';
  
  
  
}

function movimentoPlayer(){
  if(mouse.pressing()){
    player.velocity.y = tapForce
    player.addImage(playerImage2);
  }else{
    player.addImage(playerImage1);
  }
  player.rotation = 0
}

function gerarTubos() {
  let altura = random(250)
  let espacoEntreTubos = 200;
  
  // Tubo Superior
  let tuboSuperior = new tubos.Sprite()
  tuboSuperior.width = 60;
  tuboSuperior.height = altura;
  tuboSuperior.y = altura / 2;
  tuboSuperior.x = 610;
  
  //Tudo inferior
  let tuboInferior = new tubos.Sprite()
  tuboInferior.width = 60
  tuboInferior.height = height - altura - espacoEntreTubos;
  tuboInferior.y = altura + espacoEntreTubos + tuboInferior.height / 2;
  tuboInferior.x = 610;
  
  // Sensor invisível entre os tubos para contabilizar a pontuação
  let sensor = new sensores.Sprite();
  sensor.width = 50;
  sensor.height = espacoEntreTubos - 20;
  sensor.y = altura + espacoEntreTubos / 2;
  sensor.x = 610;
  sensor.visible = false;  // Sensor invisível

 // Quando o personagem passa pelo sensor, incrementa a pontuação
  sensor.overlap(player, function() {
    pontos += 1;
    sensor.remove();  // Remove o sensor após o personagem passar por ele
  });

}

function movimentoTubos(){
  // Movimenta os tubos
  tubos.forEach(function(tubo) {
    tubo.velocity.x = -2;
    
    // Se o tubo sair da tela, remove o sprite
      if (tubo.position.x < -100) {
        tubo.remove(); // Remove o tubo da memória
      }
  });
  
  //Gera novos tubos se o resto da divisão de frameCount por 300 é igual a 0
  if (frameCount % 300 === 0) {
    console.log(frameCount)
    gerarTubos();
  }
}

function movimentoSensores(){
  // Movimenta os sensores
  sensores.forEach(function(sensor) {
    sensor.velocity.x = -2;
    
  });
}

function verificaGameOver(){
  // Verifica se o player colidiu com o chão ou com os tubos
    if (player.collide(chao) || player.collide(tubos)) {
      gameOver = true; // Define o estado de game over
      player.rotation = 0
      player.velocity.x = 0
    }
}

function stopGame(){
  
  // Para os tubos
  tubos.forEach(function(tubo) {
    tubo.velocity.x = 0;
  });
  
  sensores.forEach(function(sensor){
    sensor.velocity.x = 0;
  })
  
  // Exibe o texto de Game Over
    textSize(32);
    fill(255, 0, 0);
    text('Game Over', width / 2 - 80, height / 2);
  
  //Exibe o botao restart
  restart.visible = true
}

function reiniciarJogo(){
  // Reinicia o estado do jogo
  gameOver = false;
  pontos = 0;
  restart.visible = false;

  // Remove todos os tubos e sensores existentes
  tubos.removeAll();
  sensores.removeAll();
  
  // Reposiciona o player
  player.position.y = height / 2;
  player.position.x = 100
  
  // Gera novos tubos
  gerarTubos();
}