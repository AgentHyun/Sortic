    package org.sortic.sorticproject.Entity;

    import lombok.Data;

    @Data
    public class BillCommissionDetail {
        private int billId;
        private int billCommissionId;
        private String commissionName;
        private int commission;
    }
