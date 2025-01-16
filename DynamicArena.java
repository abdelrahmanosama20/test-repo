package csen703.main.assignment2;

//import java.util.Stack;

import java.util.ArrayList;
import java.util.List;


public class DynamicArena {
	public static int recursiveCalculate(int[][] a, int n, int x, int y) {
        int sum = 0;
        //int z = y;
        
        
        // Base condition: if we're out of bounds (i + j + 3 >= n-1), return 0
        if (x >= n -1 || y >= a[x].length) {
            return sum;
        }
        
        // If the number at a[i + j + 3][0] is non-negative, proceed
        if (a[x][y] >= 0) {// el moshkela bezabt fel 7eta de, kol ma betbeda2 recursive call
            sum += a[x][y];// enta mehtag te acess awel element fel row beta3o, ba3d ma be te terminate el
            
            int nextRow = x+y + 3;// condition i+j+3>=n-1 en mehtag terga3 le awel row 3amalto access
                                  // ba3d ma mesekt awel number we betkaren be, sa3etha mehatg tekhosh 3al rakam
                                  // 3al rakam el ba3deeh
            // If the next calculated row index is out of bounds, stop recursion
            if (nextRow >= n - 1) {
                return sum;
            }
            
            // Recurse to the next row
            sum += recursiveCalculate(a, n, nextRow, y);
        }
        
        return sum;
    }

    public static int ClimbDynamicArenaDP(int[] floors) {
    	int n = floors.length;
        int[][] a = new int[n - 1][]; // 2D
        
        for (int i = 0; i < n - 1; i++) {
            a[i] = new int[n - i - 1]; 
            
            for (int j = i + 1; j < n; j++) {
                a[i][j - i - 1] = floors[j] - floors[i]; // 7ot el differences fel array
            }
        }
        //int [] b = new int[n*n];
    	//int p =0;//pointer to point on the b array
        List<Integer> bList = new ArrayList<>(); // arraylist han7ot feeha all possible value calculated
        for (int i = 0; i < a.length; i++) {     // we hanraga3 el sum
            for (int j = 0; j < a[i].length; j++) {
                int sum = 0;
                
                // law el number negative ba skip 
                if (a[i][j] >= 0) {
                    sum = a[i][j];
                    int e = i+j+3;
                    if(e>n-2) {
                        bList.add(sum); // law i+j+3>n-2 benraga3 el sum calculated fel array list
                    }else {
                    	for(int x =e; x<n-1;x++) {
                        	for(int y = 0; y<a[e].length; y++) {
                                // Call the recursive calculation for the sum                    
                        		sum += recursiveCalculate(a, n, x, y);
                                bList.add(sum); // Add sum to the list
                                 sum =a[i][j];
                        	}
                        }
                        // Store the result in the array b
                        //b[p] = sum;
                        //p++;
                    }
                }else {
                    bList.add(0); // Add zero 3ashan law el number kan negative
                }
            }
        }
        
        //return (ArrayList<Integer>) bList;
        int max = bList.get(0);        
        // Iterate through the array to find the maximum value
        for (int value : bList) {
            if (value > max) {
                max = value;
            }
        }
        
        return max;
        
        
    }



    public static void main(String[] args) {
    	int[] floors1 = {48,12,60,93,97,42,25,64,17,56,85,93,9,48,52,42,58,85,81,84,69,36,1,54,23,15,72,15,11,94};
        
        // Call the ClimbDynamicArenaDP method and get the maximum value
    	int maxReward = ClimbDynamicArenaDP(floors1);
        System.out.println("Maximum reward: " + maxReward);

}



}