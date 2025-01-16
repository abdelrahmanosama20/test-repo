package GUI;
import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;

import Components.*;

public class GUI {

    public static void main(String[] args){
        //tomasulo setup
        TomasuloProgress tomasuloProgress = new TomasuloProgress();
        tomasuloProgress.currentClock = 0;
        tomasuloProgress.generateInstructionQueueAsHashTable(2);
        tomasuloProgress.populateRegFile(); // Populate the register file
        tomasuloProgress.populateLoadBuffers();
        tomasuloProgress.populateAddReservationStations();

        int instruction_rows = 4;
        int int_rows = 4;
        int fp_rows = 4;
        int ld_rows = 4;
        int sd_rows = 4;
        int rf_rows = 4;


        JFrame fmain = new JFrame();

        JList<instruction> instructionList = new JList<>();
        fmain.setTitle("Tomasulo");
        

        JPanel rsd = new JPanel();
        JPanel begin = new JPanel();
        JPanel instructAdd = new JPanel();

        begin.setLayout(new FlowLayout());
        instructAdd.setLayout(new GridLayout(5,1));
        rsd.setLayout(new GridLayout(3,3));
        DefaultListModel<String> insts = new DefaultListModel<>();

        JList<String> instructions = new JList<>(insts);

        String[] int_queue = {"Instruction", "Instruct Reg", "j", "k", "Issue", "Execution Complete", "Write Res"};
        DefaultTableModel queue_t = new DefaultTableModel(int_queue, instruction_rows);
        JTable queue_table = new JTable(queue_t);

        //initialize components
        String[] rg = {"Reg", "Qi"};
        DefaultTableModel rgg = new DefaultTableModel(rg, rf_rows);
        JTable reg_file = new JTable(rgg);

        String[] rs = {"Time", "Tags", "Busy", "op", "vj", "vk", "qj", "qk", "A"};
        DefaultTableModel rsi = new DefaultTableModel(rs, int_rows);
        JTable rs_int = new JTable(rsi);

        DefaultTableModel rsf = new DefaultTableModel(rs, fp_rows);
        JTable rs_float = new JTable(rsf);

        String[] buffers = {"Tags", "Busy", "Address"};
        DefaultTableModel l_buff = new DefaultTableModel(buffers, ld_rows);
        JTable load_buffer = new JTable(l_buff);

        DefaultTableModel s_buff = new DefaultTableModel(buffers, sd_rows);
        JTable store_buffer = new JTable(s_buff);

        JLabel name = new JLabel("Insert Instructions:");
        JTextField insert = new JTextField();


        insert.setBounds(900, 600, 100, 30);

        //set coordinates
        rs_float.setBounds(600, 350, 50, 50);

        instructions.setBounds(80, 400, 400, 200);




        Label l1 = new Label("Tomasulo Display", 1);
        JButton b = new JButton("Add");
        b.setBounds(900, 500, 300, 60);
        b.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(ActionEvent e) {
                insts.addElement(insert.getText() + "\n");
            }
        });

        JButton bnext = new JButton("Start");
        bnext.setBounds(900, 700, 400, 200);
        bnext.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(ActionEvent e) {
                fmain.remove(begin);
                fmain.add(instructAdd);
                fmain.validate();
                fmain.repaint();
            }
        });

        JButton bstart = new JButton("Start Simulation");
        bstart.setBounds(900, 600, 300, 60);
        bstart.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(ActionEvent e) {
                fmain.remove(instructAdd);
                fmain.add(rsd);
                fmain.validate();
                fmain.repaint();
            }
        });

        JButton clocknext = new JButton("Next Clock");
        clocknext.setBounds(900, 600, 300, 60);



        begin.add(bnext);
        instructAdd.add(instructions);
        instructAdd.add(b);
        instructAdd.add(name);
        instructAdd.add(insert);
        instructAdd.add(bstart);
        rsd.add(new JScrollPane(queue_table));
        rsd.add(new JScrollPane(reg_file));
        rsd.add(new JScrollPane(rs_int));
        rsd.add(new JScrollPane(rs_float));
        rsd.add(new JScrollPane(store_buffer));
        rsd.add(new JScrollPane(load_buffer));


        fmain.setSize(1280, 720);
        fmain.setVisible(true);
        fmain.add(begin);

    }


}
