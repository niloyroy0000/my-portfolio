export const calculateDuration = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  
  // Adjust if we haven't reached the day of the month yet
  if (end.getDate() < start.getDate()) {
    months--;
  }
  
  // Handle negative months
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Add 1 to include the current month in the count
  months++;
  
  // Recalculate years and months
  if (months >= 12) {
    years += Math.floor(months / 12);
    months = months % 12;
  }
  
  if (years === 0 && months === 0) {
    return "Less than 1 month";
  } else if (years === 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  } else if (months === 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  } else {
    return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
  }
};


export const calculateFromTo = (startDate: Date, endDate: Date) => {
    const startYear = startDate.getFullYear();
    if(endDate.toDateString() === new Date().toDateString())
        return `${startYear} - Present`;
    const endYear = endDate.getFullYear();
    return `${startYear} - ${endYear}`;
  };

export const calculateFromToWithDuration = (startDate: Date, endDate: Date) => {
  const dateRange = calculateFromTo(startDate, endDate);
  const duration = calculateDuration(startDate, endDate);
  return `${dateRange}\n${duration}`;
  };

export const getDateRange = (startDate: Date, endDate: Date) => {
  return calculateFromTo(startDate, endDate);
};

export const getDuration = (startDate: Date, endDate: Date) => {
  return calculateDuration(startDate, endDate);
};

export const calculateTotalExperience = (positions: Array<{startDate: Date | string, endDate?: Date | string}>) => {
  let totalMonths = 0;
  
  positions.forEach(position => {
    const start = new Date(position.startDate);
    const end = position.endDate ? new Date(position.endDate) : new Date(); // V2: Use current date if endDate not provided
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    // Adjust if we haven't reached the day of the month yet
    if (end.getDate() < start.getDate()) {
      months--;
    }
    
    // Handle negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Add 1 to include the current month in the count
    months++;
    
    // Add total months for this position
    totalMonths += years * 12 + months;
  });
  
  const displayYears = Math.floor(totalMonths / 12);
  const displayMonths = totalMonths % 12;
  
  if (displayYears === 0) {
    return `${displayMonths} month${displayMonths > 1 ? 's' : ''}`;
  } else if (displayMonths === 0) {
    return `${displayYears} year${displayYears > 1 ? 's' : ''}`;
  } else {
    return `${displayYears}+ years`;
  }
};

export const calculateTotalCompaniesServed = (positions: Array<{company: string}>) => {
  const uniqueCompanies = new Set(positions.map(position => position.company));
  return uniqueCompanies.size;
};