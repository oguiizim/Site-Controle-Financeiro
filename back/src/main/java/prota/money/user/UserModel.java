package prota.money.user;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import prota.money.enums.RoleEnum;

@Entity
@Table(name = UserModel.tableName)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class UserModel {
    public static final String tableName = "user";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Long id;

    @Column(name = "username", unique = true, length = 100, nullable = false)
    @NotBlank(message = "Esse campo é obrigatorio")
    @Size(min = 2, max = 100)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password", length = 40, nullable = false, updatable = true)
    @NotBlank(message = "Esse campo é obrigatorio")
    @Size(min = 6, max = 40)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @CollectionTable(name = "user_role")
    @Column(name = "role", nullable = false)
    private Set<Integer> roles = new HashSet<>();

    public Set<RoleEnum> getRoles() {
        return this.roles.stream().map(x -> RoleEnum.toEnum(x)).collect(Collectors.toSet());
    }

    public void addRole(RoleEnum roleEnum) {
        this.roles.add(roleEnum.getCode());
    }
}
