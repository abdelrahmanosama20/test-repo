package Components;

import java.util.InputMismatchException;
import java.util.Scanner;

public class ALUOperations {
    public static boolean latenciesInitialized = false; // Static flag to track initialization

    // Enum to define all ALU operations
    public enum Operation {
        // Floating Point Operations
        ADD_D("ADD.D"),
        ADD_S("ADD.S"),
        SUB_D("SUB.D"),
        SUB_S("SUB.S"),
        MUL_D("MUL.D"),
        MUL_S("MUL.S"),
        DIV_D("DIV.D"),
        DIV_S("DIV.S"),

        // Integer Operations
        DADDI("DADDI"),
        DSUBI("DSUBI"),
        ADDI("ADDI"),
        SUBI("SUBI"),

        // Load Operations
        LW("LW"),
        LD("LD"),
        L_S("L.S"),
        L_D("L.D"),

        // Store Operations
        SW("SW"),
        SD("SD"),
        S_S("S.S"),
        S_D("S.D"),

        // Branching Operations
        BNE("BNE"),
        BEQ("BEQ"),
        BNEZ("BNEZ");

        private final String operationName;
        private int latency; // Latency for each operation

        // Constructor
        Operation(String operationName) {
            this.operationName = operationName;
        }

        // Getter for operation name
        public String getOperationName() {
            return operationName;
        }

        // Getter for latency
        public int getLatency() {
            return latency;
        }

        // Setter for latency
        public void setLatency(int latency) {
            this.latency = latency;
        }
    }


    public static Operation fromString(String operationName) {
        for (Operation op : Operation.values()) {
            if (op.getOperationName().equals(operationName)) {
                return op;
            }
        }
        throw new IllegalArgumentException("Invalid operation name: " + operationName);
    }
    
    
    // Method to input latencies for each operation
    public  void inputLatencies() {
    	if(!latenciesInitialized) {
        Scanner scanner = new Scanner(System.in);
        for (Operation operation : Operation.values()) {
            System.out.print("Enter latency for " + operation.getOperationName() + ": ");
            int latency = scanner.nextInt();
            operation.setLatency(latency);
        }
        latenciesInitialized=true;
        scanner.close(); 
        }
    }

    public static void main(String[] args) {
        // Test inputLatencies method
        System.out.println("Input latencies for all ALU operations:");
      //  ALUOperations.inputLatencies();

        // Display the latencies set for each operation
        System.out.println("\nLatencies for ALU Operations:");
        for (ALUOperations.Operation operation : ALUOperations.Operation.values()) {
            System.out.println(operation.getOperationName() + ": " + operation.getLatency());
        }
    }
}