export interface loansDisplayDataInterface {
    name: string;
    value: string;
    color: string;
  }

export const loansDisplayData: loansDisplayDataInterface[] = [
    {
      name: "Prospect",
      value: "PROSPECT",
      color: "rgb(124 58 237)",
    },
    {
      name: "Application",
      value: "APPLICATION",
      color: "rgb(37 99 235)",
    },
    {
      name: "Processing",
      value: "PROCESSING",
      color: "rgb(202 138 4)",
    },
    {
      name: "Underwriting",
      value: "UNDERWRITING",
      color: "rgb(234 88 12)",
    },
    {
      name: "Conditional",
      value: "CONDITIONAL",
      color: "rgb(219 39 119)",
    },
    {
      name: "Closed/Funded",
      value: "CLOSED",
      color: "rgb(22 163 74)",
    },
  ];

