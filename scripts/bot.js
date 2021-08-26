'use strict';
//基本ダイス
const Dicehantei = (y) => (Math.floor(Math.random() * y + 1))

//ダイス x=ダイスの個数 y=何面ダイスか
const Dice = (x,y) => {
let DiceResult = 0;
let Dicecheck = 0;
while(Dicecheck < x){
  DiceResult = Dicehantei(y) + DiceResult;
  Dicecheck++;
}
return DiceResult;
}

//bot組み込み用ダイス
const DiceRandom = (x,y) => {
const Number = Dice(x,y)
let DiceResult = "("+x+"d"+y+") → " + Number;
return DiceResult;

}

//成功判定を追加したダイス　z=目標値
const CheckDice = (x,y,z) =>{
  const Number = Dice(x,y);
  let CheckResult = null;
  if( Number <= z){
    CheckResult = "(" + x + "d" + y + "<=" + z + ") → " + Number + " → 成功";
    return CheckResult;
  } 
  else{
    CheckResult = "(" + x + "d" + y + "<=" + z + ") → " + Number + " → 失敗";
    return CheckResult;
  }
}

//クトゥルフ用C&F判定を追加したCheckDice
const CCB = (z) =>{
  const Number = Dice(1,100);
  let CheckResult = null;
  if( Number <= z){
    CheckResult = "(1d100<=" + z + ") → " + Number + " → 成功";
    if(Number < 6){CheckResult = "(1d100<=" + z + ") → "+ Number + " → 決定的成功";}
    return CheckResult;} 
  else{
    CheckResult = "(1d100<=" + z + ") → " + Number + " → 失敗";
    if(Number > 94){CheckResult = "(1d100<=" + z + ") → " + Number + " → 致命的失敗";}
    return CheckResult;}
}

//組み合わせロール z=目標値1　q=目標値2
const CBRB = (z,q) => {
  const Number = Dice(1,100);
  let CheckZ = null;
  let CheckQ = null;

  if(Number <= z){
    CheckZ = "成功"
    if(Number < 6){CheckZ = "決定的成功"}}
  else{CheckZ = "失敗"
  if(Number > 94){CheckZ = "致命的失敗"}};

  if(Number <= q){
    CheckQ = "成功"
    if(Number < 6){CheckQ = "決定的成功"}}
  else{CheckQ = "失敗"
  if(Number > 94){CheckQ = "致命的失敗"}};

  let CombinationResult = null; 
  if(Number <= z && Number <= q){
    CombinationResult = "(1d100<="+z+","+q+")" + " → " + Number + "["+CheckZ+","+CheckQ+"]"+ " → "+"成功";
    return CombinationResult;}
  else{CombinationResult = "(1d100<="+z+","+q+")" + " → " + Number + "["+CheckZ+","+CheckQ+"]"+ " → "+"失敗";
    return CombinationResult;}
  }

module.exports = robot => {
   //CCBの組み込み
   robot.hear(/^CCB<=(\d+)$/i,msg => {
    let input = msg.match[1];
    const mokuhyou = Number(input);
    msg.send(CCB(mokuhyou));
    });

    robot.hear(/^CCB$/i,msg => {
      msg.send(DiceRandom(1,100));
      });

    //diceの組み込み
    robot.hear(/^(\d+)d(\d+)$/i,msg => {
      let input = msg.match[0];
      let henkan = input.split('d');
      msg.send(DiceRandom(henkan[0],henkan[1]));
    });

    //CheckDiceの組み込み
    robot.hear(/^(\d+)d(\d+)<=(\d+)$/i,msg => {
      let input = msg.match[0];
      let change = input.replace('<=','d')
      let henkan = change.split('d');
      msg.send(CheckDice(henkan[0],henkan[1],henkan[2]));
    });

    //CBRBの組み込み
    robot.hear(/^CBRB\((\d+),(\d+)\)$/i,msg => {
      let input = msg.match[0];
      let change = input.replace('CBRB','');
      let change2 = change.replace(')','');
      let change3 = change2.replace(',','d')
      let change4 = change3.replace('(','');
      let henkan = change4.split('d');
      msg.send(CBRB(henkan[0],henkan[1]));
    });

};
