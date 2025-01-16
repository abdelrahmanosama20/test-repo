package Components;

import java.util.HashMap;
//import java.util.Scanner;
import java.util.Map;

public class LoadBuffer {
	public String Tag ;
    public boolean busy;
    public int address;
    public double result;
    public Integer timeRemaining; 
    public instruction instruction;
    public HashMap<Integer, RegFile> regFile; // Floating-point registers    
    public Cache cache;
    public Memory memory;
    public int Latency ;
    
 
// should also take the instance of the reg file 
  // the reg file would actually be a hashmap
public void TakingInInstruction(instruction instruction,HashMap<Integer, RegFile> regFile) {
	this.instruction=instruction;
	this.busy=true;
	this.regFile=regFile; 
	//Loop Thru the hashmap compare the destination register in the instruction with Attribute RegName
    for (Map.Entry<Integer, RegFile> entry : this.regFile.entrySet()) {
    	RegFile RegFileinstance = entry.getValue();
          if(instruction.instructionDestinationReg.equals(RegFileinstance.RegName)){
        	  RegFileinstance.q=this.Tag;
        	  break;
          }
};

}


public void IntializeTheCacheLinkToTheLoadBufferAndSettingTheLatencyAndTheMmeory(Cache cache,Memory memory) {
	this.cache=cache;
	this.memory=memory;
}



// Now we have the instruction , we should extract the operands calculate the address of the Memory where we will access to load 


public void CalculatingAddressAndAccessingMmeory() {
    // Debugging: Print the instruction values
    System.out.println("Instruction: j=" + this.instruction.j + ", k=" + this.instruction.k);

    // Assuming operands for the load are ready
    String TobeCastedtoIntegerFirstPartOfAddress = this.instruction.j;
    int FirstPartOfAddress = Integer.parseInt(TobeCastedtoIntegerFirstPartOfAddress);
    
    // Debugging: Print the first part of the address
    System.out.println("First part of address: " + FirstPartOfAddress);

    String ToBeCastedtoIntegerSecondPartOfAddress = this.instruction.k;
    if (ToBeCastedtoIntegerSecondPartOfAddress != null) {
        int SecondPartOfAddress = Integer.parseInt(ToBeCastedtoIntegerSecondPartOfAddress);
        this.address = FirstPartOfAddress + SecondPartOfAddress;
    } else {
        this.address = FirstPartOfAddress; // Just use the first part if second part is null
    }

    // Debugging: Print the calculated address
    System.out.println("Calculated Address: " + this.address);

    // Now, try to read from the cache
    System.out.println("Attempting to read data from cache...");
    
    // Uncomment this line to actually use the cache logic
    Byte data = this.cache.readFromCache(this.address, this.memory);
    
    // Debugging: Check if the cache miss flag is true
    if (this.cache.cacheMiss) {
        System.out.println("Cache miss! Data not in cache.");

        // Simulate additional latency for memory access if necessary
        int additionalLatency = 5; // Example latency for memory access
        for (int i = 0; i < additionalLatency; i++) {
            // This simulates the passage of time for memory access, which you can ignore in the print statement
        }

       
        // Debugging: Print the data fetched from memory
        System.out.println("Cache miss handled, block loaded from memory. Data: " + data);

        // Reset cacheMiss flag
        this.cache.cacheMiss = false;
    } else {
        System.out.println("Cache hit! Data: " + data);
    }

    // Update the regFile with the data from the load (this should happen after cache hit/miss)
    for (Map.Entry<Integer, RegFile> entry : this.regFile.entrySet()) {
        RegFile regFileInstance = entry.getValue();
        if (instruction.instructionDestinationReg.equals(regFileInstance.RegName)) {
            regFileInstance.q = null; // Remove tag
            regFileInstance.value = data; // Store the data in the register
            this.result = data; // Set the result in LoadBuffer to match the register value

            // Debugging: Print the updated register value
            System.out.println("Register updated with value: " + regFileInstance.value);
            System.out.println("LoadBuffer result updated: " + this.result);

            break;
        }
    }

    // After handling cache and register updates, set the station to not busy
    this.busy = false;
}


@Override
public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("LoadBuffer Details:\n");
    sb.append("Tag: ").append(Tag).append("\n");
    sb.append("Busy: ").append(busy).append("\n");
    sb.append("Address: ").append(address).append("\n");
    sb.append("Result: ").append(result).append("\n");
    sb.append("Time Remaining: ").append(timeRemaining != null ? timeRemaining : "N/A").append("\n");
    return sb.toString();
}



public static void main(String[] args) {
    // Setup a basic scenario with mock data

    // Create cache and memory objects
    Cache cache = new Cache(50, 4);
    Memory memory = new Memory();

    // Initialize a simple instruction
    instruction instr = new instruction("L.D F6,100");

    // Create a register file with mock values
    HashMap<Integer, RegFile> regFile = new HashMap<>();
    regFile.put(1, new RegFile(null, null, "F6")); //value , tag , regname

    // Create the LoadBuffer and set up
    LoadBuffer loadBuffer = new LoadBuffer();
    loadBuffer.Tag = "T1"; // Set a tag for testing
    loadBuffer.IntializeTheCacheLinkToTheLoadBufferAndSettingTheLatencyAndTheMmeory(cache, memory);
    loadBuffer.TakingInInstruction(instr, regFile);

    // Run the address calculation and cache/memory access
    loadBuffer.CalculatingAddressAndAccessingMmeory();

    // Output the status of the LoadBuffer
    System.out.println(loadBuffer);
    // Print the contents of the memory
    System.out.println("Memory contents:");
    memory.printMemory();
    // Output the updated register file
    for (Map.Entry<Integer, RegFile> entry : regFile.entrySet()) {
        System.out.println(entry.getValue());
    }
}
}




