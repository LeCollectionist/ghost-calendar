import { periodRulesValidator } from "../helpers/periodRules";

describe("Period rules", () => {
  describe("Simple minimun nights case", () => {
    it("minimum 4 nights => false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-05", dayRule: "nightly", mininumDuration: 4 },
        endAt: { date: "2023-06-07", dayRule: "nightly", mininumDuration: 4 },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });

    it("minimum 4 nights => true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-05", dayRule: "nightly", mininumDuration: 4 },
        endAt: { date: "2023-06-09", dayRule: "nightly", mininumDuration: 4 },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });
  });
  describe("Advanced minimun nights case", () => {
    it("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-06 => 5 nigths) = true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-29", dayRule: "nightly", mininumDuration: 2 },
        endAt: { date: "2023-07-06", dayRule: "nightly", mininumDuration: 7 },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });
    it("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-04 => 5 nigths) = false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-30", dayRule: "nightly", mininumDuration: 3 },
        endAt: { date: "2023-07-04", dayRule: "nightly", mininumDuration: 5 },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });
    it("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-06 => 3 nigths) = true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-30", dayRule: "nightly", mininumDuration: 3 },
        endAt: { date: "2023-07-03", dayRule: "nightly", mininumDuration: 3 },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });
    it("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-08 => 1 week) = true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-30", dayRule: "nightly", mininumDuration: 3 },
        endAt: {
          date: "2023-07-08",
          dayRule: "weekly_by_saturday",
          mininumDuration: 1,
        },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });
    it("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-09 => 1 week) = false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-30", dayRule: "nightly", mininumDuration: 3 },
        endAt: {
          date: "2023-07-09",
          dayRule: "weekly_by_saturday",
          mininumDuration: 1,
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });
    it("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-07 => 1 week) = false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-30", dayRule: "nightly", mininumDuration: 3 },
        endAt: {
          date: "2023-07-07",
          dayRule: "weekly_by_saturday",
          mininumDuration: 1,
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });
    it.skip("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-08 => 2 weeks) = false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-30", dayRule: "nightly", mininumDuration: 3 },
        endAt: {
          date: "2023-07-08",
          dayRule: "weekly_by_saturday",
          mininumDuration: 2,
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });
    it("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-08 => 2 weeks) = true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-30", dayRule: "nightly", mininumDuration: 3 },
        endAt: {
          date: "2023-07-15",
          dayRule: "weekly_by_saturday",
          mininumDuration: 2,
        },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });
    it.skip("(startDate => 2023-06-30 => 3 nights) && (endDate => 2023-07-08 => 3 weeks) = false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: { date: "2023-06-30", dayRule: "nightly", mininumDuration: 3 },
        endAt: {
          date: "2023-07-15",
          dayRule: "weekly_by_saturday",
          mininumDuration: 3,
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });
  });
  describe("Simple minimun weeks case", () => {
    it("minimum 1 week => weekly_by_saturday => true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-10",
          dayRule: "weekly_by_saturday",
          mininumDuration: 1,
        },
        endAt: {
          date: "2023-06-17",
          dayRule: "weekly_by_saturday",
          mininumDuration: 1,
        },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });

    it("minimum 1 week => weekly_by_saturday => false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-10",
          dayRule: "weekly_by_saturday",
          mininumDuration: 1,
        },
        endAt: {
          date: "2023-06-16",
          dayRule: "weekly_by_saturday",
          mininumDuration: 1,
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });

    it.skip("minimum 2 weeks => weekly_by_sunday => false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-11",
          dayRule: "weekly_by_sunday",
          mininumDuration: 2,
        },
        endAt: {
          date: "2023-06-18",
          dayRule: "weekly_by_sunday",
          mininumDuration: 2,
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });

    it("minimum 2 weeks => weekly_by_sunday => false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-11",
          dayRule: "weekly_by_sunday",
          mininumDuration: 2,
        },
        endAt: {
          date: "2023-06-25",
          dayRule: "weekly_by_sunday",
          mininumDuration: 2,
        },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });

    it("(startDate => 2023-06-16 => 2 weeks) && (endDate => 2023-07-06 => 5 nights) = true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-16",
          dayRule: "weekly_by_friday",
          mininumDuration: 2,
        },
        endAt: {
          date: "2023-07-06",
          dayRule: "nightly",
          mininumDuration: 5,
        },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });

    it("(startDate => 2023-06-15 => 2 weeks) && (endDate => 2023-07-06 => 5 nights) = false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-15",
          dayRule: "weekly_by_friday",
          mininumDuration: 2,
        },
        endAt: {
          date: "2023-07-06",
          dayRule: "nightly",
          mininumDuration: 5,
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });

    it("(startDate => 2023-06-16 => 2 weeks) && (endDate => 2023-07-05 => 5 nights) = false", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-16",
          dayRule: "weekly_by_friday",
          mininumDuration: 2,
        },
        endAt: {
          date: "2023-07-05",
          dayRule: "nightly",
          mininumDuration: 5,
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });

    it("(startDate => 2023-06-06 => 3 nights) && (endDate => 2023-06-10 => 2 nights) = true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-06",
          dayRule: "nightly",
          mininumDuration: 3,
        },
        endAt: {
          date: "2023-06-10",
          dayRule: "nightly",
          mininumDuration: 2,
        },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });

    it("(startDate => 2023-06-06 => 3 nights) && (endDate => 2023-06-10 => 2 nights) = true", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-06",
          dayRule: "nightly",
          mininumDuration: 3,
        },
        endAt: {
          date: "2023-06-10",
          dayRule: "nightly",
          mininumDuration: 2,
        },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });

    it("jdddd", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-27",
          dayRule: "nightly",
          mininumDuration: 3,
          period: { startDate: "2023-06-27", endDate: "2023-07-04" },
        },
        endAt: {
          date: "2023-07-31",
          dayRule: "weekly_by_monday",
          mininumDuration: 3,
          period: { startDate: "2023-07-24", endDate: "2023-11-06" },
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });

    it("jdddd", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-27",
          dayRule: "nightly",
          mininumDuration: 3,
          period: { startDate: "2023-06-27", endDate: "2023-07-04" },
        },
        endAt: {
          date: "2023-09-04",
          dayRule: "weekly_by_monday",
          mininumDuration: 3,
          period: { startDate: "2023-07-24", endDate: "2023-11-06" },
        },
      });
      //Then
      expect(periodIsValid).toBe(true);
    });

    it("jdddd", () => {
      //When
      const periodIsValid = periodRulesValidator({
        startAt: {
          date: "2023-06-21",
          dayRule: "nightly",
          mininumDuration: 3,
          period: { startDate: "2023-06-20", endDate: "2023-06-27" },
        },
        endAt: {
          date: "2023-06-23",
          dayRule: "nightly",
          mininumDuration: 3,
          period: { startDate: "2023-06-20", endDate: "2023-06-27" },
        },
      });
      //Then
      expect(periodIsValid).toBe(false);
    });
  });
});
