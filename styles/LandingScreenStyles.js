import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // ===========================
  // SHARED / CONTAINER STYLES
  // ===========================
  container: {
    flex: 1,
    backgroundColor: '#f7ffee',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  emoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 280,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },

  // Scrollable Manual Entry
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },

  // ===========================
  // BARCODE SCANNER VIEW
  // ===========================
  scanButton: {
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },

  // ===========================
  // SEARCH BY NAME VIEW
  // ===========================
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    outlineStyle: 'none',
    cursor: 'text',
  },
  analyzeButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },

  // ===========================
  // SHARED BETWEEN FEATURES
  // ===========================
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  toggleText: {
    fontSize: 16,
    color: '#22c55e',
    fontWeight: '500',
  },

  // Examples (used in SearchByNameView)
  examplesContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  examplesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  exampleButton: {
    flex: 1,  // Make buttons equal width
    backgroundColor: '#f7ffee',
    borderWidth: 1,
    borderColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  exampleText: {
    color: '#22c55e',
    fontSize: 13,  // Slightly smaller for two-column layout
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  exampleBarcode: {
    color: '#6b7280',
    fontSize: 10,  // Smaller barcode text
    textAlign: 'center',
  },
  examplesFlexGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleButtonFlex: {
    width: '48%',  // Two per row (with gap)
    backgroundColor: '#f7ffee',
    borderWidth: 1,
    borderColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  helperText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },

  // Web Notice (used in BarcodeScannerView for web platform)
  webNotice: {
    backgroundColor: '#f7ffee',
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  webNoticeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  webNoticeSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },

  // Camera Scanner (used in BarcodeScannerView)
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#22c55e',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  scannerText: {
    color: 'white',
    fontSize: 18,
    marginTop: 24,
    fontWeight: '600',
    textAlign: 'center',
  },

  // ===========================
  // LOADING OVERLAY (SHARED)
  // ===========================
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f7ffee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#374151',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  },

  // ===========================
  // FOOTER (SHARED)
  // ===========================
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  featureText: {
    fontSize: 12,
    color: '#9ca3af',
  },

  // ===========================
  // PRODUCT PICKER MODAL (SearchByNameView)
  // ===========================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  productList: {
    paddingHorizontal: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  noThumb: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  noThumbText: {
    fontSize: 20,
    color: '#9ca3af',
  },
  productDetails: {
    flex: 1,
  },
  productItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productItemBrand: {
    fontSize: 13,
    color: '#6b7280',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  historyButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appStoreButtonInline: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  appStoreBadgeInline: {
    width: 135,
    height: 40,
  },
  quizButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 16,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingQuizButton: {
    position: 'absolute',
    left: 20,
    bottom: 120,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fbbf24',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
  floatingQuizEmoji: {
    fontSize: 32,
  },
  floatingScanButton: {
    position: 'absolute',
    left: 20,
    bottom: 120,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#90ee90',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
  floatingScanEmoji: {
    fontSize: 32,
  },
});

export default styles;
