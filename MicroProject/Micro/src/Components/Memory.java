package Components;

import java.util.Random;

public class Memory {
    public byte[] memory;
    
    // Constructor: Initialize memory with a fixed size of 300 bytes
    public Memory() {
        this.memory = new byte[300]; // Memory size of 300 bytes
        fillMemoryWithMockData();  // Fill the memory with random mock data
    }
    
    // Method to fill memory with random mock data
    private void fillMemoryWithMockData() {
        Random rand = new Random();
        for (int i = 0; i < memory.length; i++) {
            // Fill with random values from 0 to 255 (byte range)
            memory[i] = (byte) (Math.random() * 256); // Random value between 0 and 255
        }
    }
    
    // Write a single byte to a memory address
    public void writeByte(int address, byte value) {
        if (address >= 0 && address < memory.length) {
            memory[address] = value;
        } else {
            System.out.println("Memory address out of bounds.");
        }
    }
    
    // Write a word (4 bytes) to memory
    public void writeWord(int address, byte[] values) {
        if (address >= 0 && address + 3 < memory.length && values.length == 4) {
            for (int i = 0; i < 4; i++) {
                memory[address + i] = values[i];
            }
        } else {
            System.out.println("Memory address out of bounds or invalid word size.");
        }
    }
    
    // Read a single byte from a memory address
    public byte readByte(int address) {
        if (address >= 0 && address < memory.length) {
            return memory[address];
        } else {
            System.out.println("Memory address out of bounds.");
            return -1; // Returning -1 to indicate error, can handle differently.
        }
    }
    
    // Read a word (4 bytes) from memory
    public byte[] readWord(int address) {
        if (address >= 0 && address + 3 < memory.length) {
            byte[] word = new byte[4];
            for (int i = 0; i < 4; i++) {
                word[i] = memory[address + i];
            }
            return word;
        } else {
            System.out.println("Memory address out of bounds.");
            return null; // Returning null to indicate error, can handle differently.
        }
    }

    // Print out the contents of memory for debugging purposes
    public void printMemory() {
        for (int i = 0; i < memory.length; i++) {
            System.out.print(memory[i] + " ");
            if ((i + 1) % 10 == 0) { // Print 10 bytes per line for better readability
                System.out.println();
            }
        }
    }
        public static void main(String[] args) {
            // Initialize the memory with a fixed size of 300 bytes
            Memory memory = new Memory();
            
            // Print the contents of the memory
            System.out.println("Memory contents:");
            memory.printMemory();
        }
    

}
