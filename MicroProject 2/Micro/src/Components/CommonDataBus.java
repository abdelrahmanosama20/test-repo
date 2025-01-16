package Components;

public class CommonDataBus {
        // Fields
        private String tag;       // Tag of the instruction/result being broadcasted
        private double value;     // The result value being broadcasted
        private boolean busy;     // Indicates if the CDB is currently in use
    
        // Constructor
        public CommonDataBus() {
            this.tag = null;
            this.value = 0.0;
            this.busy = false;
        }
    
        // Methods
    
        /**
         * Broadcast a result on the CDB.
         *
         * @param tag   The tag identifying the source of the result.
         * @param value The result value to broadcast.
         */
        public void broadcast(String tag, double value) {
            if (this.busy) {
                throw new IllegalStateException("CDB is already busy broadcasting!");
            }
            this.tag = tag;
            this.value = value;
            this.busy = true;
        }
    
        /**
         * Clear the CDB after a broadcast cycle.
         */
        public void clear() {
            this.tag = null;
            this.value = 0.0;
            this.busy = false;
        }
    
        /**
         * Check if the CDB is currently busy.
         *
         * @return True if the CDB is in use, false otherwise.
         */
        public boolean isBusy() {
            return busy;
        }
    
        /**
         * Get the tag currently being broadcasted.
         *
         * @return The tag as a String, or null if no broadcast is active.
         */
        public String getTag() {
            return tag;
        }
    
        /**
         * Get the value currently being broadcasted.
         *
         * @return The result value.
         */
        public double getValue() {
            return value;
        }
    }