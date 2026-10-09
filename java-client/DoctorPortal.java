import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;

public class DoctorPortal extends JFrame {
    private JTable appointmentTable;
    private DefaultTableModel tableModel;
    private JTextField doctorNameField;
    private JButton refreshButton, cancelBtn;

    private static final String DB_URL = "jdbc:mysql://localhost:3306/rishi_health_db";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "root";

    public DoctorPortal() {
        setTitle("Rishi Health - Clinician Desktop System (Java JDBC)");
        setSize(850, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        JPanel headerPanel = new JPanel();
        headerPanel.setBackground(new Color(2, 132, 199));
        JLabel titleLabel = new JLabel("RISHI HEALTH CLINICAL CONSOLE (JAVA / SWING / JDBC)");
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 15));
        headerPanel.add(titleLabel);
        add(headerPanel, BorderLayout.NORTH);

        String[] columns = {"ID", "Patient Email", "Doctor Name", "Specialty", "Date", "Time"};
        tableModel = new DefaultTableModel(columns, 0);
        appointmentTable = new JTable(tableModel);
        appointmentTable.setRowHeight(24);
        JScrollPane scrollPane = new JScrollPane(appointmentTable);
        add(scrollPane, BorderLayout.CENTER);

        JPanel controlPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 15, 10));
        controlPanel.setBackground(new Color(240, 249, 255));

        controlPanel.add(new JLabel("Doctor Filter:"));
        doctorNameField = new JTextField("Dr. Rishi Pal", 15);
        controlPanel.add(doctorNameField);

        refreshButton = new JButton("Load Assigned Queue");
        cancelBtn = new JButton("Cancel Selected Record");

        controlPanel.add(refreshButton);
        controlPanel.add(cancelBtn);
        add(controlPanel, BorderLayout.SOUTH);

        refreshButton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                loadAppointments(doctorNameField.getText().trim());
            }
        });

        cancelBtn.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                int selectedRow = appointmentTable.getSelectedRow();
                if (selectedRow == -1) {
                    JOptionPane.showMessageDialog(null, "Please select an appointment from the table.");
                    return;
                }
                int id = Integer.parseInt(tableModel.getValueAt(selectedRow, 0).toString());
                deleteAppointment(id);
            }
        });

        loadAppointments(doctorNameField.getText().trim());
    }

    private void loadAppointments(String doctorName) {
        tableModel.setRowCount(0);
        String query = "SELECT id, patient_email, doctor_name, specialty, appointment_date, appointment_time " +
                       "FROM appointments WHERE doctor_name LIKE ? ORDER BY id DESC";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            JOptionPane.showMessageDialog(this, "Driver not found: " + e.getMessage());
            return;
        }

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, "%" + doctorName + "%");
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                tableModel.addRow(new Object[]{
                    rs.getInt("id"),
                    rs.getString("patient_email"),
                    rs.getString("doctor_name"),
                    rs.getString("specialty"),
                    rs.getString("appointment_date"),
                    rs.getString("appointment_time")
                });
            }
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Database Connection Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void deleteAppointment(int appointmentId) {
        String query = "DELETE FROM appointments WHERE id = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, appointmentId);
            stmt.executeUpdate();
            JOptionPane.showMessageDialog(this, "Appointment cancelled and removed from MySQL!");
            loadAppointments(doctorNameField.getText().trim());
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "SQL Deletion Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new DoctorPortal().setVisible(true));
    }
}
