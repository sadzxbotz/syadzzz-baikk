
const questions = [
  {q:'Dimana aku lahir?', img:'city.png', a:['Jakarta','Bandung','Surabaya','Yogyakarta'], correct:0},
  {q:'Makanan favoritku?', img:'food.png', a:['Nasi Goreng','Sushi','Pizza','Rendang'], correct:3},
  {q:'Hobi favoritku?', img:'game.png', a:['Membaca','Bermain game','Berkebun','Olahraga'], correct:1},
  {q:'Warna kesukaanku?', img:'color.png', a:['Merah','Biru','Hitam','Hijau'], correct:2},
  {q:'Peliharaan favorit?', img:'pet.png', a:['Kucing','Anjing','Burung','Tidak punya'], correct:3},
  {q:'Genre musik favoritku?', img:'music.png', a:['Pop','Rock','Klasik','EDM'], correct:0},
  {q:'Minuman pagi favoritku?', img:'coffee.png', a:['Kopi','Teh','Jus','Susu'], correct:0},
  {q:'Aku suka liburan ke...', img:'beach.png', a:['Pantai','Gunung','Kota besar','Desa'], correct:1},
  {q:'Aku paling takut...', img:'fear.png', a:['Ketinggian','Gelap','Ular','Tertinggal'], correct:0},
  {q:'Aku biasanya bangun jam?', img:'alarm.png', a:['05:00','07:00','09:00','11:00'], correct:1}
];
let answers = Array(questions.length).fill(null);
let index = 0;
let player = "";

function startQuiz(){
  player = document.getElementById('name').value.trim();
  if(!player){alert('Masukkan nama dulu!');return;}
  document.getElementById('intro').style.display='none';
  document.getElementById('quiz').style.display='block';
  showQ();
}
function showQ(){
  const q = questions[index];
  document.getElementById('qnum').innerText = `Pertanyaan ${index+1}/${questions.length}`;
  document.getElementById('qimg').src = 'img/' + q.img;
  document.getElementById('question').innerText = q.q;
  const box = document.getElementById('answers');
  box.innerHTML = '';
  q.a.forEach((ans,i)=>{
    const div = document.createElement('div');
    div.className = 'choice' + (answers[index]===i?' selected':'');
    div.innerText = ans;
    div.onclick = ()=>{answers[index]=i; showQ();};
    box.appendChild(div);
  });
}
function nextQ(){
  if(index < questions.length-1){index++;showQ();}
  else{finish();}
}
function prevQ(){
  if(index>0){index--;showQ();}
}
function finish(){
  let score=0;
  questions.forEach((q,i)=>{ if(answers[i]===q.correct) score++; });
  document.getElementById('quiz').style.display='none';
  document.getElementById('result').style.display='block';
  document.getElementById('score').innerText = `${player}, skor kamu ${score}/10`;
  document.getElementById('rating').innerText = `Rating ${score}/10`;
}
