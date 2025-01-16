package Components;


public class Cache {
    public int cacheSize; // Number of bytes the cache can hold
    public int blockSize; // Number of bytes fetched from memory in one go
    public byte[] cache;  // Cache storage
    public int cacheIndex = 0; // Points to the next position to write in the cache
    public int[] byteFetchedFromMmeoryAddress;
    public boolean cacheMiss = false; // New flag to indicate cache miss

    public Cache(int cacheSize, int blockSize) {
        this.cacheSize = cacheSize;
        this.blockSize = blockSize;
        this.cache = new byte[cacheSize]; // Initialize the cache
        this.byteFetchedFromMmeoryAddress = new int[blockSize];
    }
 
    // Generalized method to fetch a block of bytes from memory
    public byte[] fetchBlockFromMemory(int address, Memory memory) {
        // Ensure the address is valid
        if (address < 0 || address + blockSize - 1 >= memory.memory.length) {
            throw new IllegalArgumentException("Address out of bounds");
        }

        // Fetch the specified number of bytes (blockSize) from memory
        byte[] block = new byte[blockSize];
        for (int i = 0; i < blockSize; i++) {
            block[i] = memory.memory[address + i];
            byteFetchedFromMmeoryAddress[i]=address+i;
        }

        // Save the block into the cache
        saveBlockToCache(block);

        return block;
    }

    // Save the block to the cache
    private void saveBlockToCache(byte[] block) {
        // Check if there’s enough space in the cache
        if (cacheIndex + blockSize > cacheSize) {
            // Reset the index to overwrite from the beginning (simple eviction policy)
            cacheIndex = 0;
        }

        // Write the block to the cache at the current index
        for (int i = 0; i < blockSize; i++) {
            cache[cacheIndex + i] = block[i];
        }

        // Move the cache index forward
        cacheIndex += blockSize;
    }
    
    
    public Byte readFromCache(int address, Memory memory) {
        // Check if the address is in the byteFetchedFromMemoryAddress array
        for (int i = 0; i < blockSize; i++) {
            if (byteFetchedFromMmeoryAddress[i] == address) {
                // Address found, fetch the corresponding byte from the cache
                int cacheIndex = (this.cacheIndex - blockSize + i) % cacheSize;
                return cache[cacheIndex];
            }
        }

        // If address not found (cache miss), load the block from memory
        cacheMiss = true; // Set the miss flag
        System.out.println("Cache miss! Fetching block from memory...");
        byte[] block = fetchBlockFromMemory(address, memory);
        
        // After fetching the block, check again if the address is now in the cache
        for (int i = 0; i < blockSize; i++) {
            if (byteFetchedFromMmeoryAddress[i] == address) {
                // Address found after loading from memory, return the data
                int cacheIndex = (this.cacheIndex - blockSize + i) % cacheSize;
                return cache[cacheIndex];
            }
        }

        // If for some reason the address is still not found, return null
        return null;
    }


    
    
    
    public static void main(String[] args) {
        // Create a memory of 256 bytes (example size)
        Memory memory = new Memory();

        // Fill memory with sample data (0 to 255)


        // Create a cache with size 16 bytes and block size 4 bytes
        Cache cache = new Cache(16, 4);

        // Fetch a block from memory (e.g., starting at address 8)
        System.out.println("Fetching block starting at address 8...");
        byte[] block1 = cache.fetchBlockFromMemory(8, memory);

        // Print the block fetched
        System.out.print("Block fetched: ");
        for (byte b : block1) {
            System.out.print(b + " ");
        }
        System.out.println();

        // Simulate reading a byte from the cache
        System.out.println("Reading from cache address 10...");
        Byte data = cache.readFromCache(10,memory);
        if (data != null) {
            System.out.println("Cache hit! Data: " + data);
        } else {
            System.out.println("Cache miss!");
        }

        // Simulate reading an address not in cache
        System.out.println("Reading from cache address 20...");
        Byte dataMiss = cache.readFromCache(20,memory);
        if (dataMiss != null) {
            System.out.println("Cache hit! Data: " + dataMiss);
        } else {
            System.out.println("Cache miss!");
        }
    }
    
    
    
    
}
