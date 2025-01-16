package Components;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Scanner;
import java.util.concurrent.atomic.AtomicBoolean;

public class TomasuloProgress {
    public HashMap<Integer, ReservationStationEntry> addReservationStations; // Use HashMap for add reservation stations
    public HashMap<Integer, ReservationStationEntry> mulReservationStations; // Use HashMap for mul reservation stations
    public HashMap<Integer, LoadBuffer> loadBuffers; // Use HashMap for load buffers
    public HashMap<Integer, StoreBuffer> storeBuffers; // Use HashMap for store buffers
    public int nextIssue;
    public int currentClock;
    // private List<InstructionHistoryEntry> instructionHistory;
    public HashMap<Integer, instruction> instructionQueue; // Use HashMap for instructions with indices as keys
    public Cache cache; // Memory cache
    public Memory memory ;
    public HashMap<Integer, RegFile> fpRegisters; // Floating-point registers
    public HashMap<Integer, RegFile> intRegisters; // Integer registers
    public HashMap<String, Integer> latencies; // Instruction latencies
    
    public TomasuloProgress() {
        this.instructionQueue = new HashMap<>();
        this.fpRegisters = new HashMap<>();
        this.intRegisters = new HashMap<>();
        this.addReservationStations = new HashMap<>();
        this.mulReservationStations = new HashMap<>();
        this.loadBuffers = new HashMap<>();
        this.storeBuffers = new HashMap<>();
        this.memory = new Memory();
    //    this.cache =  new Cache(0, 0);
    }


    public void generateInstructionQueueAsHashTable(int numnOfInstructions) {
        for (int i = 0; i < numnOfInstructions; i++) {
            instruction instruction =this.promptInstruction(i);
            instructionQueue.put(i, instruction);
        }
    }
    public instruction promptInstruction(int i) {
        Scanner scanner = new Scanner(System.in);
        // Prompt the user to enter an instruction
        System.out.print("Enter an instruction: ");
        String instruction = scanner.nextLine();
      //  scanner.close();
        instruction parsedInstruction = new instruction(instruction);
        return parsedInstruction ;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Instruction Queue:\n");
        for (Map.Entry<Integer, instruction> entry : instructionQueue.entrySet()) {
            Integer index = entry.getKey();
            instruction instr = entry.getValue();
            sb.append("Index ").append(index).append(": ").append(instr).append("\n");
        }
     //   this.populateRegFile();
        return sb.toString();
    }
      
    public void populateRegFile() {
        System.out.println("Populating Integer Registers...");
        
        for (Map.Entry<Integer, instruction> entry : instructionQueue.entrySet()) {
            instruction instr = entry.getValue();

            String destinationReg = instr.instructionDestinationReg;
            String operand1Reg = instr.j;
            String operand2Reg = instr.k;

            // Check if destination register already exists
            if (!regFileContains(destinationReg)) {
                RegFile destinationRow = new RegFile(null, null, destinationReg);
                intRegisters.put(intRegisters.size(), destinationRow);
                System.out.println("Added to intRegisters: " + destinationRow);
            }

            // Check if operand1 register already exists
            if (operand1Reg.matches(".*[fF].*") && !regFileContains(operand1Reg)) {
                RegFile operand1Row = new RegFile(null, null, operand1Reg);
                intRegisters.put(intRegisters.size(), operand1Row);
                System.out.println("Added to intRegisters: " + operand1Row);
            }

            // Check if operand2 register already exists
            if(operand2Reg!=null) {
            if (operand2Reg.matches(".*[fF].*") && !regFileContains(operand2Reg)) {
                RegFile operand2Row = new RegFile(null, null, operand2Reg);
                intRegisters.put(intRegisters.size(), operand2Row);
                System.out.println("Added to intRegisters: " + operand2Row);
            } }
        }
    }

    // Helper method to check if a register already exists in the map
    private boolean regFileContains(String regName) {
        for (RegFile reg : intRegisters.values()) {
            if (reg.RegName.equalsIgnoreCase(regName)) {
                return true;
            }
        }
        return false;
    }

    
    
    public void printIntRegisters() {
        System.out.println("Integer Registers Content:");
        if (this.intRegisters.isEmpty()) {
            System.out.println("No entries in intRegisters.");
            return;
        }
        for (Map.Entry<Integer, RegFile> entry : this.intRegisters.entrySet()) {
            System.out.println("Index " + entry.getKey() + ": " + entry.getValue().toString());
        }
    }

    public void populateLoadBuffers() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter Number Of Load Buffers: ");
        String StringNumOfBuffers = scanner.nextLine();
        int numOfBuffers = Integer.parseInt(StringNumOfBuffers);
     //   scanner.close();
        // takes the number of wanted loadbuffers , in our design that means the number of rows in one load buffer 
    	// what we need to do is to dynamically add to the hashmap , that numofbuffers many times instances 
         for(int i=0;i<numOfBuffers;i++) {
	            LoadBuffer LoadBuffers = new LoadBuffer();
	            //created an instance of a load buffer , set the tag of each one 
	            LoadBuffers.Tag="L"+i;
	            //Add it to the hashmap
	            loadBuffers.put(i, LoadBuffers);
                  }
         }
    public void populateAddReservationStations() {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter Number Of Reserv Add Stations: ");
        String StringNumOfAddResStations = scanner.nextLine();
        int NumOfAddResStations = Integer.parseInt(StringNumOfAddResStations);
        
        for(int i=0;i<NumOfAddResStations;i++) {
        	ReservationStationEntry AddResStation = new ReservationStationEntry();
        	AddResStation.Tag="A"+i;
        	addReservationStations.put(i, AddResStation);
        	
        }

    }
 
       public void HelperMethodForLoopingOnTheAddReservationStations(AtomicBoolean noAvailableStation , instruction instr ) {
           for (Map.Entry<Integer, ReservationStationEntry> reservationAddStations : this.addReservationStations.entrySet()) {
               ReservationStationEntry addStation = reservationAddStations.getValue();
               if(!addStation.busy){
               	//Send the instruction to that station 
                   addStation.takeinstruction(instr, this.intRegisters);
                   noAvailableStation.set(false); // A station was found, so set the flag to false
                   break;
               }
       }
       } 
       public void HelperMethodForLoopingOnTheLoadStations(AtomicBoolean noAvailableStation , instruction instr ) {
           for (Entry<Integer, LoadBuffer> InLoadStation : this.loadBuffers.entrySet()) {
               LoadBuffer LoadStation = InLoadStation.getValue();
               if(!LoadStation.busy){
               	//Send the instruction to that station 
            	   LoadStation.TakingInInstruction(instr, this.intRegisters);
                   noAvailableStation.set(false); // A station was found, so set the flag to false
                   System.out.println(LoadStation.toString());
                   
                   break;
               }
       }
       }
    public void FindResStation() {
        // Loop through the instruction queue        
        for (Map.Entry<Integer, instruction> entry : instructionQueue.entrySet()) {
            Integer instructionIndex = entry.getKey();
            instruction instr = entry.getValue();
        	this.nextIssue=this.currentClock;
          instr.issue=this.nextIssue;
            // Get the operation type (e.g., ADD.D, MUL.D, etc.)
            String operation = instr.instructionOP;
            // Determine which reservation station to use based on the operation
            if (operation.equals(ALUOperations.Operation.ADD_D.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.ADD_S.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.SUB_D.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.SUB_S.getOperationName())) {
            	AtomicBoolean noAvailableStation = new AtomicBoolean(true);
            	this.HelperMethodForLoopingOnTheAddReservationStations(noAvailableStation, instr);
                    //
                if (!noAvailableStation.get()) {
                    instructionQueue.remove(instructionIndex); // Remove the instruction if issued
                    break; // Only issue one instruction per clock cycle
                }
               

                }else if (operation.equals(ALUOperations.Operation.MUL_D.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.MUL_S.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.DIV_D.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.DIV_S.getOperationName())) {

                // Add the instruction to the MulReservationStations
                mulReservationStations.put(instructionIndex, new ReservationStationEntry());

            } else if (operation.equals(ALUOperations.Operation.LW.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.LD.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.L_S.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.L_D.getOperationName())) {

            	AtomicBoolean noAvailableStation = new AtomicBoolean(true);
            	this.HelperMethodForLoopingOnTheLoadStations(noAvailableStation, instr);
                    //
                if (!noAvailableStation.get()) {
                    instructionQueue.remove(instructionIndex); // Remove the instruction if issued
                    break; // Only issue one instruction per clock cycle
                }
                
                
                
                
                
                
                
            } else if (operation.equals(ALUOperations.Operation.SW.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.SD.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.S_S.getOperationName()) ||
                    operation.equals(ALUOperations.Operation.S_D.getOperationName())) {

                // Add the instruction to the StoreBuffers
                storeBuffers.put(instructionIndex, new StoreBuffer(instr));
            }
        }
    } 
    
 // Execution Stage
    public void execute(ReservationStationEntry station) {
        instruction instruction = station.instruction;

        // Skip execution if operands are not ready
        if (station.qj != null || station.qk != null) {
            System.out.println("Skipping execution for ADD station because operands are not ready.");
            return;
        }

        // Set operation name and latency
        String operationName = station.op;
        ALUOperations.Operation operation = ALUOperations.fromString(operationName);
        ALUOperations op = new ALUOperations();

        if (station.timeRemaining == null) {
            op.inputLatencies(); // Ensure latencies are provided
            station.timeRemaining = operation.getLatency();                
            instruction.executionStart = this.currentClock;
            System.out.println("Execution start set for instruction at index to clock cycle: " + this.currentClock);
        }

        // Decrement time remaining if execution is in progress
        if (station.timeRemaining > 0) {
            station.timeRemaining -= 1;
            System.out.println("Executing in ADD station... Time remaining: " + station.timeRemaining);
        }

        // Execution complete
        if (station.timeRemaining == 0) {
            switch (station.op) {
                case "ADD.D":
                case "ADD.S":
                    station.result = station.vj + station.vk;
                    break;

                case "SUB.D":
                case "SUB.S":
                    station.result = station.vj - station.vk;
                    break;

                default:
                    System.out.println("Unsupported operation: " + station.op);
                    break;
            }

            // Mark execution finish
            instruction.executionFinish = this.currentClock;
            System.out.println("Execution complete. Execution finish set to clock: " + this.currentClock);

            // Clear station and remove instruction
            station.timeRemaining = null;
            station.busy = false;
            station.instruction = null;
        }
    }
    
    public void LoadExecution(LoadBuffer loadStation) {
    	//The Load we will access the cache to search if the data with the given effective addess is present or not
    	//This method acts for a single LoadStation
    	//Firstly we will prompt the user to enter the data for the cache , Cache Size and The cache block
    	instruction instruction = loadStation.instruction;
        // Set operation name and latency
        String operationName ="L.D";
        ALUOperations.Operation operation = ALUOperations.fromString(operationName);
        ALUOperations op = new ALUOperations();

        if (loadStation.timeRemaining == null) {
            Scanner scanner = new Scanner(System.in);
            System.out.print("Enter the Cache Size: ");
            int Cachesize = scanner.nextInt();  // Read the first integer
            System.out.print("Enter the block size: ");
            int BlockSize = scanner.nextInt();  // Read the second integer
            this.cache = new Cache(Cachesize, BlockSize);
            op.inputLatencies(); // Ensure latencies are provided
            loadStation.timeRemaining = operation.getLatency();                
            instruction.executionStart = this.currentClock;
            System.out.println("Execution start set for instruction at index to clock cycle: " + this.currentClock);
        }
        
        
        // Decrement time remaining if execution is in progress
        if (loadStation.timeRemaining > 0) {
        	loadStation.timeRemaining -= 1;
            System.out.println("Executing in LOAD station... Time remaining: " + loadStation.timeRemaining);
        }
        // Execution complete
        if (loadStation.timeRemaining == 0) {
        loadStation.IntializeTheCacheLinkToTheLoadBufferAndSettingTheLatencyAndTheMmeory(this.cache,this.memory);
        loadStation.CalculatingAddressAndAccessingMmeory(); 
        
        instruction.executionFinish = this.currentClock;
        System.out.println("Execution complete. Execution finish set to clock: " + this.currentClock);
        // Clear station and remove instruction
        loadStation.timeRemaining = null;
        loadStation.busy = false;
        loadStation.instruction = null;
        
        }
    }
    
public static void main(String[] args) {
    TomasuloProgress tomasuloProgress = new TomasuloProgress();
    tomasuloProgress.currentClock = 0;
    tomasuloProgress.generateInstructionQueueAsHashTable(2);
    tomasuloProgress.populateRegFile(); // Populate the register file
    tomasuloProgress.populateLoadBuffers();
    tomasuloProgress.populateAddReservationStations(); // Create and tag reservation stations

    while (!tomasuloProgress.instructionQueue.isEmpty() || tomasuloProgress.areStationsBusy()) {
        System.out.println("Clock Cycle: " + tomasuloProgress.currentClock);
        tomasuloProgress.printIntRegisters();

        // Issue stage: Assign instructions to stations
        tomasuloProgress.FindResStation();

        // Execute stage: Process all Add reservation stations
        for (Map.Entry<Integer, ReservationStationEntry> entry : tomasuloProgress.addReservationStations.entrySet()) {
            ReservationStationEntry station = entry.getValue();

            // Execute if the station is busy
            if (station.busy) {
                tomasuloProgress.execute(station);
            }
        }
        //Executing the load 
        for (Entry<Integer, LoadBuffer> entry : tomasuloProgress.loadBuffers.entrySet()) {
            LoadBuffer station = entry.getValue();
            if(station.busy) {
            	tomasuloProgress.LoadExecution(station);
            }

        }
        // Increment clock cycle
        tomasuloProgress.currentClock++ ; }
    }
    
    // Helper method to check if any reservation station is still busy
    public boolean areStationsBusy() {
    	int AtLeastOneAddStationBusy=0;
    	int AtLeastOneMultStationBusy=0;
    	int AtLeastOneLoadStationBusy=0;
    	int AtLestOneStoreStationBusy=0;
        for (ReservationStationEntry station : this.addReservationStations.values()) {
            if (station.busy) {
            	AtLeastOneAddStationBusy=1;
            	break;
            }
        }
        for (ReservationStationEntry station : this.mulReservationStations.values()) {
            if (station.busy) {
            	AtLeastOneMultStationBusy=1;
            	break;
            }
        }
        for (LoadBuffer station : this.loadBuffers.values()) {
            if (station.busy) {
            	AtLeastOneLoadStationBusy=1;
            	break;
            }
        }
        for (StoreBuffer station : this.storeBuffers.values()) {
            if (station.busy) {
            	AtLestOneStoreStationBusy=1;
            	break;
            }
        }
        if(AtLeastOneAddStationBusy==1||AtLeastOneMultStationBusy==1||
           AtLeastOneLoadStationBusy==1||AtLestOneStoreStationBusy==1) {
        	return true ;
        }
        
        return false;
    }

}