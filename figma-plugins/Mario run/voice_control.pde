import processing.sound.*;
import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;


Amplitude amp;
AudioIn in;
Sound sound;
Robot robot;

void setup() {
  size(640, 360);
  background(255);
  //println(Sound.list());
  
  
  try { 
    robot = new Robot();
  } catch (AWTException e) {
    e.printStackTrace();
    exit();
  }        
  
  amp = new Amplitude(this);
  in = new AudioIn(this, 0);
  in.start();
  amp.input(in);
  
 
}      

void draw() {
  
  
  float volume = amp.analyze()*1000;
  
  println(volume);
  
  if(volume > 400)
  {
    robot.keyPress(KeyEvent.VK_SPACE);
    robot.keyRelease(KeyEvent.VK_SPACE);
  }
  
  delay(300);
}

void keyPressed() {
  //Detect space key presses (to show that it   works)
  if(key == ' ') {
    println("Space!");
  }
}
