var suits = ["hearts", "diamonds", "clubs", "spades"];
var values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];   
var pre = "cards/";
var ext = ".png";
var cardsDrawn = 0;
var p1CardCount = 7;
var aiCardCount = 7;
var p1Hand = new Array();
var aiHand = new Array();

//lets create a card Object

function get_rules()
{
alert("1. The player gets 7 cards, so does the AI.\n2. Player asks AI question for a card that they have in their hand.\n3. If AI has the card, they will give it to the player\n4. Otherwise they will say gofish!, and the player will automaticaly be dealt one card from the pile\n5. play continues till all cards are drawn\n6. objective is to have 4 of the same number/face-card and make suits \n7. if the player has more suits than the AI he wins! " )
}



function Card(suit, value, precedent, filename) {
  this.suit = suit;
  this.value = value;
  this.imageFile = filename;
  this.precedent = precedent;
}

function draw()
{
  cardsDrawn++;
  return deck.pop();
}

function shuffle(deck)
{
  var counter = deck.length, temp, index;
  while(counter > 0)
  {
    index = Math.floor(Math.random() * counter);
    // Pick a random index

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = deck[counter];
    deck[counter] = deck[index];
    deck[index] = temp;
  }
  return deck;
}

var deck = new Array();
//lets create the deck
//lets go through the suits

function createDeck()
{
  cardsDrawn = 0;
  deck = new Array();
  p1Hand.length = 0;
  aiHand.length = 0;
  for(var suit = 0; suit < suits.length; suit++)
  {
    for(var value = 0; value < values.length; value++)
    {
      var imageFile = pre + values[value] + "_of_" + suits[suit] + ext;
      var card = new Card(suits[suit], values[value], value, imageFile);
      deck.push(card);
    }
  }

  //lets print out the deck
  console.log(deck);
  //lets shuffle the deck`
  shuffle(deck);
  //lets deal the cards
  p1Hand.push(draw());
  p1Hand.push(draw());
  p1Hand.push(draw());
  p1Hand.push(draw());
  p1Hand.push(draw());
  p1Hand.push(draw());
  p1Hand.push(draw());
  aiHand.push(draw());
  aiHand.push(draw());
  aiHand.push(draw());
  aiHand.push(draw());
  aiHand.push(draw());
  aiHand.push(draw());
  aiHand.push(draw());

  console.log(deck);
}

function getScore(hand)
{
  var total = 0;
  for(var index = 0; index < hand.length; index++)
  {
    var precedent = hand[index].precedent;
    //console.log("precedent: " + precedent);
    total += Number(precedent);
  }
  return total;
}

function loadImages(sources, callback) {
  var cardImages = new Array();
  var loadedImages = 0;
  var numImages = cardsDrawn;

  var card_back = new Image();
  card_back.src = pre + "card_back" + ext;

  for(var index = 0; index < cardsDrawn; index++) {
    cardImages[index] = new Image();
    cardImages[index].onload = function() {
      if(++loadedImages >= numImages) {
        callback(cardImages, card_back);
      }
    };
    cardImages[index].src = sources[index];
  }
  loadedImages = 0
}

var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');


var sources;
function load()
{
  context.clearRect(0,0, window.innerWidth, window.innerHeight);
    //load hands into View
  sources = new Array();
  p1Hand.sort(function(a, b){return a.precedent - b.precedent});
  aiHand.sort(function(a, b){return a.precedent - b.precedent});
  for(var index  = 0; index < aiHand.length; index++)
  {
    sources.push(aiHand[index].imageFile);
  }
  for(var index  = 0; index < p1Hand.length; index++)
  {
    sources.push(p1Hand[index].imageFile);
  }
  //card back
  loadImages(sources, function(cardImages, card_back) {
    var cardX = 20;
    var cardY = 30;
    for(var index = 0; index < cardsDrawn; index++)
    {
      if(index == aiHand.length)
      {
        cardX = 20;
        cardY = 300;
      }
      //print out hand total
      if(index%2 != 0) //odd index
      {
          context.font = '40pt Arial';
          context.fillStyle = 'white';
          if(index == 6)
          context.fillText(getScore(p1Hand), window.innerWidth/2, cardY + cardX + cardImages[index].height*.25/2);
      }
      if(index < aiHand.length){
        context.drawImage(card_back, cardX += card_back.width*.25/3, cardY, card_back.width*.25, card_back.height*.25);
      }else{
        context.drawImage(cardImages[index], cardX += cardImages[index].width*.25/3, cardY, cardImages[index].width*.25, cardImages[index].height*.25);
      }


    }
  });

}

function go_fish(hand)
{
  if(hand == 'p1')
  {
    console.log('p1');
    p1Hand.push(draw());
  }else if(hand == 'ai'){
    console.log('ai')
    aiHand.push(draw());
  }
  load();
}


function gameOver()
{
  confirm("Game over");
}

function findCardAI(hand, value)
{
  if(deck.length <= 0)
  {
    gameOver();
    return;
  }
  var originHand;
  var destHand;
  if(hand == "p1")
  {
    originHand = p1Hand;
    destHand = aiHand;
  }else if(hand == "ai")
  {
    originHand = aiHand;
    destHand = p1Hand;
  }
  var foundCard = false;
  for (var index = 0; index < originHand.length; index++)
  {
    if(originHand[index].value == value)
    {
      var found = originHand[index]; 
      //remove card from hand and send to destHand
      originHand = originHand.splice(index, 1);
      destHand.push(found);
      foundCard = true;
      break;
    }
  }
  if(!foundCard) //other player didn't have the card, lets go fish
  {
    console.log("Go fish!");
    if(hand == "p1")
    {
      go_fish('ai');
    }else{
      go_fish('p1');
    }
  }
  load();
}

function playAi()
{
    var precedent = Math.floor(Math.random()*13); //number between 0-12 inclusive
    if(precedent <= 8){
      precedent += 2;
    }else{
      switch(precedent)
      {
        case 9:
          precedent = "jack";
          break;
        case 10:
          precedent = "queen";
          break;
        case 11:
          precedent = "king";
          break;
        case 12:
          precedent = "ace";
          break;
      }
    }
    findCardAI("p1", precedent.toString());
}



function findCard(hand, value)
{
  if(deck.length <= 0)
  {
    gameOver();
    return;
  }
  var originHand;
  var destHand;
  if(hand == "p1")
  {
    originHand = p1Hand;
    destHand = aiHand;
  }else if(hand == "ai")
  {
    originHand = aiHand;
    destHand = p1Hand;
  }
  var foundCard = false;
  for (var index = 0; index < originHand.length; index++)
  {
    if(originHand[index].value == value)
    {
      var found = originHand[index]; 
      //remove card from hand and send to destHand
      originHand = originHand.splice(index, 1);
      destHand.push(found);
      foundCard = true;
      break;
    }
  }
  if(!foundCard) //other player didn't have the card, lets go fish
  {
    console.log("Go fish!");
    if(hand == "p1")
    {
      go_fish('ai');
    }else{
      go_fish('p1');
    }
  }
  load();
  //ai's turn 
  playAi();
}



createDeck();
load();
