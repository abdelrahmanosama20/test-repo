package Components;

import java.util.Hashtable;

public class RegFile {
    public Byte value;
    public String q; // Tag
    public String RegName;

    public RegFile(Byte value, String q, String regName) {
        this.value = value;
        this.q = q;
        this.RegName = regName;
    }

    @Override
    public String toString() {
        return "RegFile {value='" + value + 
               "', tag='" + q + 
               "', regName='" + RegName + "'}";
    }
}
