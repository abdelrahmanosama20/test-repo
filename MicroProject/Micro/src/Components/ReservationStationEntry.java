package Components;

import java.util.HashMap;
import java.util.Map;

public class ReservationStationEntry {
    public boolean busy;
    public String Tag ;
    public String op;
    public Double vj; // Use Double for optional values (nullable).
    public Double vk; // Use Double for optional values (nullable).
    public String qj;
    public String qk;
    public Integer timeRemaining; // Use Integer for optional values (nullable).
    public Double result; // Use Double for optional values (nullable).
    public Integer currentIndex; // Use Integer for optional values (nullable).
    public instruction instruction;
    public HashMap<Integer, RegFile> regFile; // Floating-point registers    
    // tag string


    public void takeinstruction(instruction instruction,HashMap<Integer, RegFile> regFile) {
    	this.instruction=instruction;
    	this.busy=true;
    	this.regFile=regFile;
    	//Loop Thru the hashmap compare the destination register in the instruction with Attribute RegName
        for (Map.Entry<Integer, RegFile> entry : this.regFile.entrySet()) {
        	RegFile RegFileinstance = entry.getValue();
      	  if(RegFileinstance.RegName.equals("F8")||RegFileinstance.RegName.equals("F2")) {
    		  System.out.print("ANAAAA D5LT GOWA EL IF EYHAHA");
    		  RegFileinstance.value=(byte) 5.0;
    	  }
              if(instruction.instructionDestinationReg.equals(RegFileinstance.RegName)){
            	  RegFileinstance.q=this.Tag;

            //	  break;
              }
    };
    this.setTheStation();
    }

    
    
    
    //EL FKRA EN DY LAZM M3 KOL CLOCK CYCLE A RUNHA TANI 
    //We have the instruction so that we can access its attributes comfortably 
    public void setTheStation() {
    	//The busy attribute and the tag are set , we here should focus on the opCode , vj,vk,qj,qk
    	this.op=this.instruction.instructionOP;
    	// setting vj vk or qj qk , depends on if the Tag is found in the reg file or nah , if found then this means that the instruction isnt ready
    	//Look we only set tags for the destination registers 
    	//Any Register that has a tag in the regfile , we should set Q not the V
    	
    	String FirstOperand=this.instruction.j;
    	for(Map.Entry<Integer,RegFile> entry : this.regFile.entrySet()) {
        	RegFile OneRowInRegFile = entry.getValue();
        	String Comparison = OneRowInRegFile.RegName;
        if(	Comparison.equalsIgnoreCase(FirstOperand)) {
        	String Q =OneRowInRegFile.q ;
        	if(Q == null) {
        	Double ValueToBePlacedInVJ=	(double)OneRowInRegFile.value;
        	this.vj=ValueToBePlacedInVJ;
        	}else {
        		this.qj=Q;
        	}
        	break;
        }

    	}
    	String SecondOperand = this.instruction.k;
    	for(Map.Entry<Integer,RegFile> entry : this.regFile.entrySet()) {
        	RegFile OneRowInRegFile = entry.getValue();
        	String Comparison = OneRowInRegFile.RegName;
        if(	Comparison.equalsIgnoreCase(SecondOperand)) {
        	String Q =OneRowInRegFile.q ;
        	if(Q == null) {
        	Double ValueToBePlacedInVK=	(double)OneRowInRegFile.value;
        	this.vk=ValueToBePlacedInVK;
        	}else {
        		this.qj=Q; //7ot el tag fl q 
        	}
        	break;
        }
    	}
    	
    	
    	
    	System.out.println(this.toString());

    }
    
    
    
    @Override
    public String toString() {
        return "ReservationStationEntry {" +
                "\n  busy=" + busy +
                ",\n  Tag='" + Tag + '\'' +
                ",\n  op='" + op + '\'' +
                ",\n  vj=" + vj +
                ",\n  vk=" + vk +
                ",\n  qj='" + qj + '\'' +
                ",\n  qk='" + qk + '\'' +
                ",\n  timeRemaining=" + timeRemaining +
                ",\n  result=" + result +
                ",\n  currentIndex=" + currentIndex +
                ",\n  instruction=" + instruction +
                ",\n  regFile=" + regFile +
                "\n}";
    }


}