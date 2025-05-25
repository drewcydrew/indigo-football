import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  cloudIconButton: {
    padding: 8,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    // Ensure full screen coverage on web if needed
    // height: Platform.OS === 'web' ? '100vh' : '100%',
  },
  modalView: {
    width: 300, // Default width
    padding: 20,
    maxHeight: "80%", // Max height to prevent overflow
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  optionsContainer: {
    width: "100%",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Distributes space between buttons
    width: "100%",
    marginTop: 15,
  },
  collectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    width: "100%",
  },
  collectionNameText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  collectionDateText: {
    fontSize: 12,
    // color will be set by theme or default
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
    // width: "100%", // Applied in specific cases or via buttonRow
  },
  saveButton: {
    backgroundColor: "#4CAF50", // Green
  },
  loadButton: {
    backgroundColor: "#2196F3", // Blue
  },
  cancelButton: {
    backgroundColor: "#f44336", // Red or a more neutral grey like #607D8B
    flex: 1, // Take up available space in buttonRow
    marginRight: 5, // Space between buttons
  },
  confirmButton: {
    backgroundColor: "#4CAF50", // Green
    flex: 1, // Take up available space in buttonRow
    marginLeft: 5, // Space between buttons
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#607D8B", // Grey
    marginTop: 5, // Add some space if it's the last button
    width: "100%", // Make it full width if it's standalone
  },
  collectionInputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  inputLabel: {
    marginBottom: 5,
    fontWeight: "500",
    // color will be set by theme or default
  },
  collectionInput: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10, // Increased padding for better touch
    width: "100%",
    marginBottom: 10,
    // borderColor and color will be set by theme
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // borderWidth: 1, // Border can be on the TextInput itself
    // borderRadius: 5, // Border can be on the TextInput itself
    // marginBottom: 10, // If border is here
  },
  eyeIcon: {
    padding: 8, // Make it easier to tap
    // position: "absolute", // Not needed if TextInput has flex: 1
    // right: 5,
    // height: "100%", // Not needed
    // justifyContent: "center", // Not needed
  },
  helperText: {
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.7,
    marginTop: -8, // Adjust as needed if input has margin
    marginBottom: 10,
    textAlign: "center",
  },
  // Specific styles for collection list modal if different from generic modalView
  collectionsModalView: {
    width: 350, // Wider for list content
    // maxHeight: "80%", // Already in modalView, but can be overridden
  },
  // Specific style for text in ListEmptyComponent
  listEmptyText: {
    textAlign: "center",
    marginVertical: 20,
    // color will be set by theme or default
  },
  // Style for the OK button in status dialogs
  statusOkButton: {
    width: "100%", // Make OK button full width
  },
});
