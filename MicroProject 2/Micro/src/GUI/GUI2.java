package GUI;

import Components.*;


import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Map;

public class GUI2 {

    private TomasuloProgress tomasuloProgress;
    private JFrame frame;
    private JTable instructionTable, registerTable, addStationTable, loadBufferTable;
    private JLabel clockLabel;
    private JButton nextCycleButton;

    public GUI2() {
        tomasuloProgress = new TomasuloProgress();
        tomasuloProgress.currentClock = 0;
        tomasuloProgress.generateInstructionQueueAsHashTable(5);
        tomasuloProgress.populateRegFile();
        tomasuloProgress.populateLoadBuffers();
        tomasuloProgress.populateAddReservationStations();
        initializeGUI();
    }

    private void initializeGUI() {
        frame = new JFrame("Tomasulo Simulator");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(800, 600);

        JPanel mainPanel = new JPanel(new BorderLayout());
        clockLabel = new JLabel("Clock Cycle: 0", SwingConstants.CENTER);
        clockLabel.setFont(new Font("Arial", Font.BOLD, 16));
        mainPanel.add(clockLabel, BorderLayout.NORTH);

        JTabbedPane tabbedPane = new JTabbedPane();

        // Instruction Queue Tab
        JPanel instructionPanel = new JPanel(new BorderLayout());
        instructionTable = new JTable();
        instructionPanel.add(new JScrollPane(instructionTable), BorderLayout.CENTER);
        tabbedPane.addTab("Instruction Queue", instructionPanel);

        // Register File Tab
        JPanel registerPanel = new JPanel(new BorderLayout());
        registerTable = new JTable();
        registerPanel.add(new JScrollPane(registerTable), BorderLayout.CENTER);
        tabbedPane.addTab("Register File", registerPanel);

        // Add Reservation Stations Tab
        JPanel addStationPanel = new JPanel(new BorderLayout());
        addStationTable = new JTable();
        addStationPanel.add(new JScrollPane(addStationTable), BorderLayout.CENTER);
        tabbedPane.addTab("Add Reservation Stations", addStationPanel);

        // Load Buffers Tab
        JPanel loadBufferPanel = new JPanel(new BorderLayout());
        loadBufferTable = new JTable();
        loadBufferPanel.add(new JScrollPane(loadBufferTable), BorderLayout.CENTER);
        tabbedPane.addTab("Load Buffers", loadBufferPanel);

        mainPanel.add(tabbedPane, BorderLayout.CENTER);

        nextCycleButton = new JButton("Next Cycle");
        nextCycleButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                performNextCycle();
            }
        });
        mainPanel.add(nextCycleButton, BorderLayout.SOUTH);

        frame.add(mainPanel);
        frame.setVisible(true);

        updateTables();
    }

    private void updateTables() {
        // Update clock label
        clockLabel.setText("Clock Cycle: " + tomasuloProgress.currentClock);

        // Update Instruction Queue Table
        DefaultTableModel instructionModel = new DefaultTableModel(new String[]{"Index", "Instruction"}, 0);
        for (Map.Entry<Integer, instruction> entry : tomasuloProgress.instructionQueue.entrySet()) {
            instructionModel.addRow(new Object[]{entry.getKey(), entry.getValue()});
        }
        instructionTable.setModel(instructionModel);

        // Update Register File Table
        DefaultTableModel registerModel = new DefaultTableModel(new String[]{"Index", "Register Name", "Value"}, 0);
        for (Map.Entry<Integer, RegFile> entry : tomasuloProgress.intRegisters.entrySet()) {
            registerModel.addRow(new Object[]{entry.getKey(), entry.getValue().RegName, entry.getValue().value});
        }
        registerTable.setModel(registerModel);

        // Update Add Reservation Stations Table
        DefaultTableModel addStationModel = new DefaultTableModel(new String[]{"Tag", "Busy", "Operation", "Vj", "Vk", "Qj", "Qk", "Result"}, 0);
        for (Map.Entry<Integer, ReservationStationEntry> entry : tomasuloProgress.addReservationStations.entrySet()) {
            ReservationStationEntry station = entry.getValue();
            addStationModel.addRow(new Object[]{station.Tag, station.busy, station.op, station.vj, station.vk, station.qj, station.qk, station.result});
        }
        addStationTable.setModel(addStationModel);

        // Update Load Buffers Table
        DefaultTableModel loadBufferModel = new DefaultTableModel(new String[]{"Tag", "Busy", "Address", "Result"}, 0);
        for (Map.Entry<Integer, LoadBuffer> entry : tomasuloProgress.loadBuffers.entrySet()) {
            LoadBuffer buffer = entry.getValue();
            loadBufferModel.addRow(new Object[]{buffer.Tag, buffer.busy, buffer.address, buffer.result});
        }
        loadBufferTable.setModel(loadBufferModel);
    }

    private void performNextCycle() {
        tomasuloProgress.currentClock++;

        // Issue stage
        tomasuloProgress.FindResStation();

        // Execute stage for Add Reservation Stations
        for (Map.Entry<Integer, ReservationStationEntry> entry : tomasuloProgress.addReservationStations.entrySet()) {
            ReservationStationEntry station = entry.getValue();
            if (station.busy) {
                tomasuloProgress.execute(station);
            }
        }

        // Execute stage for Load Buffers
        for (Map.Entry<Integer, LoadBuffer> entry : tomasuloProgress.loadBuffers.entrySet()) {
            LoadBuffer station = entry.getValue();
            if (station.busy) {
                tomasuloProgress.LoadExecution(station);
            }
        }

        // Update GUI tables
        updateTables();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new GUI2());
    }
}
