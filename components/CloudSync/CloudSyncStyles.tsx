import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

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
    padding: 20,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    width: "100%",
    maxWidth: 400,
    maxHeight: height * 0.8,
  },
  optionsContainer: {
    width: "100%",
    marginVertical: 20,
    gap: 12,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#f44336",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
    gap: 12,
  },
  collectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    width: "100%",
    borderRadius: 8,
    marginBottom: 4,
  },
  collectionNameText: {
    fontWeight: "600",
    fontSize: 16,
  },
  collectionDateText: {
    fontSize: 12,
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  loadButton: {
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#607D8B",
    flex: 1,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#607D8B",
    marginTop: 16,
    width: "100%",
  },
  collectionInputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    fontWeight: "500",
    fontSize: 16,
  },
  collectionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 4,
    fontSize: 16,
    minHeight: 48,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  eyeIcon: {
    padding: 12,
    minWidth: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  helperText: {
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.7,
    marginTop: -8,
    marginBottom: 10,
    textAlign: "center",
  },
  collectionsModalView: {
    width: "100%",
    maxWidth: 450,
    maxHeight: height * 0.8,
  },
  listEmptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
  statusOkButton: {
    width: "100%",
  },
});
