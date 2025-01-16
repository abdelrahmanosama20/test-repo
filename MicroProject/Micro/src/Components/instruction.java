package Components;

public class instruction {

    public String instructionOP; // Operation (e.g., ADD, MUL, etc.)
    public String instructionDestinationReg; // Destination register
    public String j; // First operand
    public String k; // Second operand
    public Integer issue; // Issue cycle
    public Integer executionStart; // Execution start cycle
    public Integer executionFinish; // Execution finish cycle
    public Integer writeBack; // Write-back cycle
    // private String toStation; // Reservation station

    // Constructor to parse the string
    public instruction(String instruction) {
        if (instruction != null && !instruction.isEmpty()) {
            // Trim any leading/trailing spaces
            instruction = instruction.trim();

            // Parse opcode (everything until the first space)
            int firstSpaceIndex = instruction.indexOf(' ');
            if (firstSpaceIndex != -1) {
                this.instructionOP = instruction.substring(0, firstSpaceIndex);

                // Parse destination register (everything after the space up to the first comma)
                int firstCommaIndex = instruction.indexOf(',', firstSpaceIndex + 1);
                if (firstCommaIndex != -1) {
                    this.instructionDestinationReg = instruction.substring(firstSpaceIndex + 1, firstCommaIndex).trim();

                    // Parse first operand (everything after the first comma up to the second comma)
                    int secondCommaIndex = instruction.indexOf(',', firstCommaIndex + 1);
                    if (secondCommaIndex != -1) {
                        this.j = instruction.substring(firstCommaIndex + 1, secondCommaIndex).trim();

                        // Parse second operand (everything after the second comma)
                        this.k = instruction.substring(secondCommaIndex + 1).trim();
                    } else {
                        // No second comma means only one operand
                        this.j = instruction.substring(firstCommaIndex + 1).trim();
                        this.k = null;
                    }
                } else {
                    // No comma means no operands
                    this.instructionDestinationReg = instruction.substring(firstSpaceIndex + 1).trim();
                    this.j = null;
                    this.k = null;
                }
            }
        }
    }

     @Override
     public String toString() {
     return "Instruction {" +
     "operation='" + instructionOP + '\'' +
     ", destinationReg='" + instructionDestinationReg + '\'' +
     ", operand1='" + j + '\'' +
     ", operand2='" + k + '\'' +
     ", issue=" + issue +
     ", executionStart=" + executionStart +
     ", executionFinish=" + executionFinish +
     ", writeBack=" + writeBack +
    // ", toStation='" + toStation + '\'' +
     '}';
     }

    public static void main(String[] args) {
        instruction instr1 = new instruction("L.D F6,0");
        instruction instr2 = new instruction("SUB.D F8,F2,F6");

        // Print the objects
        System.out.println(instr1); // toString() is implicitly called
        System.out.println(instr2); // toString() is implicitly called
    }

}