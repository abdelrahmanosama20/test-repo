package Components;

import java.util.Hashtable;

public class StoreBuffer {
    public boolean busy;
    private int address;
    private Double result; // Can be null
    private Integer timeRemaining; // Nullable
    private int currentIndex;
    private Double v; // Can be null
    private String q; // Can be null
    public instruction instruction;

    // Constructor
    public StoreBuffer(instruction instruction) {
        // this.busy = busy;
        // this.address = address;
        // this.result = result;
        // this.timeRemaining = timeRemaining; // Nullable
        // this.currentIndex = currentIndex;
        // this.v = v;
        // this.q = q;
        this.instruction = instruction;
    }

    // Getter for busy
    public boolean isBusy() {
        return busy;
    }

    // Setter for busy
    public void setBusy(boolean busy) {
        this.busy = busy;
    }

    // Getter for address
    public int getAddress() {
        return address;
    }

    // Setter for address
    public void setAddress(int address) {
        this.address = address;
    }

    // Getter for result
    public Double getResult() {
        return result;
    }

    // Setter for result
    public void setResult(Double result) {
        this.result = result;
    }

    // Getter for timeRemaining
    public Integer getTimeRemaining() {
        return timeRemaining; // Nullable
    }

    // Setter for timeRemaining
    public void setTimeRemaining(Integer timeRemaining) {
        this.timeRemaining = timeRemaining; // Nullable
    }

    // Getter for currentIndex
    public int getCurrentIndex() {
        return currentIndex;
    }

    // Setter for currentIndex
    public void setCurrentIndex(int currentIndex) {
        this.currentIndex = currentIndex;
    }

    // Getter for v
    public Double getV() {
        return v;
    }

    // Setter for v
    public void setV(Double v) {
        this.v = v;
    }

    // Getter for q
    public String getQ() {
        return q;
    }

    // Setter for q
    public void setQ(String q) {
        this.q = q;
    }

    public instruction geInstruction() {
        return instruction;
    }

}