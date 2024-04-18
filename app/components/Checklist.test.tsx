import { render, screen } from '@testing-library/react';
import Checklist from './Checklist';

describe('Checklist component', () => {
  test('renders checklist items', () => {
    const loan = { id: '1', borrowerName: 'John Doe' };
    const isDocumentChecklist = true;
    const documentChecklist = [
      { id: '1', status: 'RECEIVED', createdAt: '2022-01-01', important: true, documentName: 'Document 1', dueDate: '2022-01-10' },
      { id: '2', status: 'PENDING', createdAt: '2022-01-02', important: false, documentName: 'Document 2', dueDate: '2022-01-15' },
    ];
    render(<Checklist loan={loan} isDocumentChecklist={isDocumentChecklist} />);
    
    // Check if checklist items are rendered
    const checklistItems = screen.getAllByRole('row');
    expect(checklistItems).toHaveLength(documentChecklist.length + 1); // +1 for table header row
    
    // Check if checklist item details are rendered correctly
    documentChecklist.forEach((item) => {
      const statusCell = screen.getByText(item.status);
      const createdByCell = screen.getByText(`On ${item.createdAt}`);
      const importantBadge = item.important ? screen.getByTestId('important-badge') : screen.getByText('N/A');
      const documentNameCell = screen.getByText(item.documentName);
      const dueDateCell = screen.getByText(item.dueDate ? item.dueDate : 'None');
      
      expect(statusCell).toBeInTheDocument();
      expect(createdByCell).toBeInTheDocument();
      expect(importantBadge).toBeInTheDocument();
      expect(documentNameCell).toBeInTheDocument();
      expect(dueDateCell).toBeInTheDocument();
    });
  });
});