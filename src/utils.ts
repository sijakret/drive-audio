
export function formatMs(milliseconds: number) {
  let hours = `0${new Date(milliseconds).getHours() - 1}`.slice(-2);
  let minutes = `0${new Date(milliseconds).getMinutes()}`.slice(-2);
  let seconds = `0${new Date(milliseconds).getSeconds()}`.slice(-2);
  hours = hours !== '00' ? hours+':' : ''
  
  return `${hours}${minutes}:${seconds}`
}


export function run(fps:number, callback:Function) {
  const frameTime = 1000 / fps;                            
  let last = performance.now();
  let abort = false;
  function loop() { 
    const now = performance.now();
    if (now - last > frameTime) {
      last = now;
      callback();
    }
    !abort && requestAnimationFrame(loop)
  }
  loop();
  return () => { abort = true };
}
