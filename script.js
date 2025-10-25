/* Firebase-enabled quiz script */
const firebaseConfig = {"apiKey": "AIzaSyADPcpfjjMXqv3DmBR9tmQ7_x0NtwvLB08", "authDomain": "kayyy-3588f.firebaseapp.com", "databaseURL": "https://kayyy-3588f-default-rtdb.firebaseio.com", "projectId": "kayyy-3588f", "storageBucket": "kayyy-3588f.firebasestorage.app", "messagingSenderId": "304987329935", "appId": "1:304987329935:web:db3a9d952a5c790133a7fa", "measurementId": "G-F8YPNQXGSD"};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const questions = [
  {q:'Di kota mana aku lahir?', img:'city.png', a:['Jakarta','Bandung','Surabaya','Yogyakarta'], correct:0},
  {q:'Makanan favoritku apa?', img:'food.png', a:['Nasi goreng','Sushi','Pizza','Rendang'], correct:3},
  {q:'Hobi apa yang sering kulakukan di waktu luang?', img:'game.png', a:['Membaca','Bermain game','Berkebun','Olahraga'], correct:1},
  {q:'Warna favoritku?', img:'color.png', a:['Merah','Biru','Hitam','Hijau'], correct:2},
  {q:'Siapa nama hewan peliharaanku (jika ada)?', img:'pet.png', a:['Kiko','Bello','Momo','(Tidak punya)'], correct:3},
  {q:'Genre musik yang kusuka?', img:'music.png', a:['Pop','Rock','Klasik','EDM'], correct:0},
  {q:'Minuman pagi favoritku?', img:'coffee.png', a:['Kopi','Teh','Jus','Susu'], correct:0},
  {q:'Aku lebih suka liburan ke...', img:'beach.png', a:['Pantai','Gunung','Kota besar','Desa'], correct:1},
  {q:'Aku paling takut dengan...', img:'fear.png', a:['Ketinggian','Gelap','Ular','Tertinggal'], correct:0},
  {q:'Aku biasanya bangun jam berapa?', img:'alarm.png', a:['05:00','07:00','09:00','11:00'], correct:1}
];

let answers = Array(questions.length).fill(null);
let indexQ = 0;
let player = '';

document.getElementById('startBtn').addEventListener('click', startQuiz);
document.getElementById('nextBtn').addEventListener('click', nextQ);
document.getElementById('prevBtn').addEventListener('click', prevQ);

function startQuiz(){
  player = document.getElementById('name').value.trim();
  if(!player){ alert('Masukkan nama dulu!'); return; }
  document.getElementById('intro').style.display = 'none';
  document.getElementById('quiz').style.display = 'block';
  indexQ = 0;
  answers = Array(questions.length).fill(null);
  showQ();
}

function showQ(){
  const q = questions[indexQ];
  document.getElementById('qnum').innerText = `Pertanyaan ${indexQ+1}/${questions.length}`;
  document.getElementById('qimg').src = 'img/' + q.img;
  document.getElementById('question').innerText = q.q;
  const box = document.getElementById('answers'); box.innerHTML = '';
  q.a.forEach((opt,i)=>{
    const d = document.createElement('div');
    d.className = 'choice' + (answers[indexQ]===i? ' selected':'');
    d.innerText = String.fromCharCode(65+i) + '. ' + opt;
    d.onclick = ()=>{ answers[indexQ]=i; showQ(); };
    box.appendChild(d);
  });
  // enable/disable buttons
  document.getElementById('prevBtn').disabled = (indexQ===0);
  document.getElementById('nextBtn').innerText = (indexQ === questions.length-1) ? 'Selesai' : 'Selanjutnya';
}

function nextQ(){
  if(indexQ < questions.length-1){ indexQ++; showQ(); }
  else { finish(); }
}
function prevQ(){ if(indexQ>0){ indexQ--; showQ(); } }

function finish(){
  let score = 0;
  for(let i=0;i<questions.length;i++){ if(answers[i] === questions[i].correct) score++; }
  document.getElementById('quiz').style.display = 'none';
  document.getElementById('result').style.display = 'block';
  document.getElementById('score').innerText = `${player}, skor kamu ${score}/${questions.length}`;
  document.getElementById('rating').innerText = `Rating ${score}/${questions.length}`;

  // push to firebase leaderboard
  const entry = { name: player, score: score, time: Date.now() };
  db.ref('leaderboard').push(entry).catch(err=>console.error(err));

  // listen for leaderboard changes and render
  db.ref('leaderboard').on('value', snapshot => {
    const data = snapshot.val() || {};
    const arr = Object.keys(data).map(k => ({ id: k, ...data[k] }));
    arr.sort((a,b) => b.score - a.score || a.time - b.time);
    const container = document.getElementById('leaderboard'); container.innerHTML = '';
    arr.forEach((p, idx) => {
      const el = document.createElement('div');
      el.className = 'leader-item';
      el.innerHTML = `<div class="name">${idx+1}. ${p.name}</div><div class="score">${p.score}/${questions.length}</div>`;
      container.appendChild(el);
    });
  });
}

// initial load of leaderboard (so visitors see it even tanpa main)
db.ref('leaderboard').once('value').then(snapshot => {
  const data = snapshot.val() || {};
  const arr = Object.keys(data).map(k => ({ id: k, ...data[k] }));
  arr.sort((a,b) => b.score - a.score || a.time - b.time);
  const container = document.getElementById('leaderboard'); container.innerHTML = '';
  arr.forEach((p, idx) => {
    const el = document.createElement('div');
    el.className = 'leader-item';
    el.innerHTML = `<div class="name">${idx+1}. ${p.name}</div><div class="score">${p.score}/${questions.length}</div>`;
    container.appendChild(el);
  });
}).catch(e=>console.error(e));
