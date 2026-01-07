import * as Tone from 'tone'
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4","8n");
document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const room = params.get("room")?.trim();
  
    console.log("type:", type);
    console.log("room:", room);
  
    if (type !== "music") {
      alert("不正なアクセスです");
      return;
    }
  
    const roomInitMap = {
      "1": initRoom1,
      "2": initRoom2,
      "3": initRoom3,
      "4": initRoom4,
    };
  
    if (!roomInitMap[room]) {
      alert("存在しない部屋です");
      return;
    }
  
    roomInitMap[room]();
  
    function initRoom1() {
      console.log("♫ 音楽バトル 1号室 初期化");
    }
  
    function initRoom2() {
      console.log("♫ 音楽バトル 2号室 初期化");
    }
  
    function initRoom3() {
      console.log("♫ 音楽バトル 3号室 初期化");
    }
    
    function initRoom4() {
      console.log("♫ 音楽バトル 4号室 初期化");
    }
  });

